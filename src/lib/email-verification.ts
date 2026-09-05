import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashCode(email: string, code: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET must be configured");
  return crypto.createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email delivery is not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Verify your ShowListing email",
      html: `<main style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px"><h1 style="color:#2563eb">ShowListing</h1><h2>Verify your email</h2><p>Use this code to verify your ShowListing account:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not create an account, you can ignore this email.</p></main>`,
    }),
  });
  if (!response.ok) throw new Error("Email delivery failed");
}

export async function issueVerificationCode(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true, verificationSentAt: true } });
  if (!user || user.emailVerifiedAt) return { sent: true };
  if (user.verificationSentAt && Date.now() - user.verificationSentAt.getTime() < RESEND_COOLDOWN_MS) {
    return { sent: false, retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - user.verificationSentAt.getTime())) / 1000) };
  }
  const code = crypto.randomInt(100_000, 1_000_000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationCodeHash: hashCode(email, code), verificationExpiresAt: new Date(Date.now() + OTP_TTL_MS), verificationAttempts: 0, verificationSentAt: new Date() },
  });
  try {
    await sendVerificationEmail(email, code);
  } catch (error) {
    await prisma.user.update({ where: { id: user.id }, data: { verificationCodeHash: null, verificationExpiresAt: null } });
    throw error;
  }
  return { sent: true };
}

export async function verifyEmailCode(email: string, code: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true, verificationCodeHash: true, verificationExpiresAt: true, verificationAttempts: true } });
  if (!user || user.emailVerifiedAt) return { verified: false, error: "Invalid or expired verification code." };
  if (!user.verificationCodeHash || !user.verificationExpiresAt || user.verificationExpiresAt < new Date() || user.verificationAttempts >= MAX_ATTEMPTS) {
    return { verified: false, error: "Invalid or expired verification code." };
  }
  if (!crypto.timingSafeEqual(Buffer.from(user.verificationCodeHash), Buffer.from(hashCode(email, code)))) {
    await prisma.user.update({ where: { id: user.id }, data: { verificationAttempts: { increment: 1 } } });
    return { verified: false, error: "Invalid or expired verification code." };
  }
  await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date(), verificationCodeHash: null, verificationExpiresAt: null, verificationAttempts: 0 } });
  return { verified: true };
}
