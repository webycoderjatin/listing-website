import { NextResponse } from "next/server";
import { issueVerificationCode } from "@/lib/email-verification";
import { readBoundedText } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = readBoundedText(body.email, 254).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "If an account exists, a code has been sent." });
    const result = await issueVerificationCode(email);
    return result.sent ? NextResponse.json({ message: "If an account exists, a code has been sent." }) : NextResponse.json({ message: `Please wait ${result.retryAfterSeconds} seconds before requesting another code.` }, { status: 429 });
  } catch {
    return NextResponse.json({ message: "Unable to send a verification code. Please try again." }, { status: 503 });
  }
}
