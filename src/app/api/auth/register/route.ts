import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { readBoundedText } from "@/lib/validation";
import { issueVerificationCode } from "@/lib/email-verification";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const normalizedName = readBoundedText(name, 120);
    const normalizedEmail = readBoundedText(email, 254).toLowerCase();

    if (!normalizedName || !normalizedEmail || typeof password !== "string") {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 8) {
      return NextResponse.json(
        { message: "Enter a valid email and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.user.create({
        data: { name: normalizedName, email: normalizedEmail, password: hashedPassword, role: "USER" },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json({ message: "User already exists" }, { status: 409 });
      }
      throw error;
    }

    try {
      await issueVerificationCode(normalizedEmail);
    } catch {
      return NextResponse.json({ message: "Account created, but we could not send a verification code. Please use resend." }, { status: 202 });
    }
    return NextResponse.json({ message: "Account created. Check your email for a verification code." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
