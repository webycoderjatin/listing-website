import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, businessId } = await req.json() as Record<string, string | undefined>;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !businessId) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay credentials are not configured");
      return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = razorpay_signature.length === expectedSignature.length
      && crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { business: { select: { ownerId: true } } },
    });

    if (!payment || payment.businessId !== businessId || payment.business.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment is not pending" }, { status: 409 });
    }

    const verified = await prisma.$transaction(async (tx) => {
      const businessUpdate = await tx.business.updateMany({
        where: { id: payment.businessId, status: "PENDING_PAYMENT" },
        data: { status: "PENDING_APPROVAL" },
      });
      if (businessUpdate.count !== 1) return false;

      const paymentUpdate = await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "SUCCESS",
          paidAt: new Date(),
        },
      });
      return paymentUpdate.count === 1;
    });

    if (!verified) {
      return NextResponse.json({ error: "Payment has already been processed" }, { status: 409 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
