import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { isExpectedListingPayment } from "@/lib/listing";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, businessId } = await req.json() as Record<string, unknown>;
    if (![razorpay_order_id, razorpay_payment_id, razorpay_signature, businessId].every((value) => typeof value === "string" && value.length > 0)) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay credentials are not configured");
      return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
    }

    const orderId = razorpay_order_id as string;
    const paymentId = razorpay_payment_id as string;
    const signature = razorpay_signature as string;
    const requestedBusinessId = businessId as string;
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = signature.length === expectedSignature.length
      && crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { business: { select: { ownerId: true } } },
    });

    if (!payment || payment.businessId !== requestedBusinessId || payment.business.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment is not pending" }, { status: 409 });
    }

    if (!isExpectedListingPayment(payment.amount, payment.currency)) {
      console.error("Stored payment amount does not match the listing price", { paymentId: payment.id });
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 409 });
    }

    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID ?? "", key_secret: keySecret });
    const razorpayPayment = await razorpay.payments.fetch(paymentId);
    if (razorpayPayment.order_id !== orderId || razorpayPayment.amount !== payment.amount || razorpayPayment.currency !== payment.currency || !["authorized", "captured"].includes(razorpayPayment.status)) {
      return NextResponse.json({ error: "Payment details could not be confirmed" }, { status: 400 });
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
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
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
