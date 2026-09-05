import { NextResponse } from "next/server";
import { verifyEmailCode } from "@/lib/email-verification";
import { readBoundedText } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = readBoundedText(body.email, 254).toLowerCase();
    const code = readBoundedText(body.code, 6);
    if (!/^\S+@\S+\.\S+$/.test(email) || !/^\d{6}$/.test(code)) return NextResponse.json({ message: "Enter a valid six-digit code." }, { status: 400 });
    const result = await verifyEmailCode(email, code);
    return result.verified ? NextResponse.json({ verified: true }) : NextResponse.json({ message: result.error }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Unable to verify email." }, { status: 500 });
  }
}
