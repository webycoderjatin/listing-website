import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { isExpectedListingPayment, LISTING_CURRENCY, LISTING_PRICE_PAISE } from "@/lib/listing";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await req.json() as { businessId?: unknown };
    if (typeof businessId !== "string" || !businessId.trim()) {
      return NextResponse.json({ error: "Business id is required" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Business not found or unauthorized" }, { status: 403 });
    }

    if (business.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "This listing is not awaiting payment" }, { status: 409 });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { businessId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (existingPayment) {
      if (!isExpectedListingPayment(existingPayment.amount, existingPayment.currency)) {
        console.error("Pending payment amount does not match the listing price", { paymentId: existingPayment.id });
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 409 });
      }
      return NextResponse.json({
        orderId: existingPayment.razorpayOrderId,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error("Razorpay credentials are not configured");
      return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
    }

    const amount = LISTING_PRICE_PAISE;
    const currency = LISTING_CURRENCY;

    const options = {
      amount,
      currency,
      receipt: `rcpt_${businessId.substring(0, 20)}`,
    };

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create(options);

    try {
      await prisma.payment.create({
        data: { businessId, razorpayOrderId: order.id as string, amount, currency, status: "PENDING" }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const pendingPayment = await prisma.payment.findFirst({ where: { businessId, status: "PENDING" }, orderBy: { createdAt: "desc" } });
        if (pendingPayment) return NextResponse.json({ orderId: pendingPayment.razorpayOrderId, amount: pendingPayment.amount, currency: pendingPayment.currency });
      }
      throw error;
    }

    return NextResponse.json({ orderId: order.id, amount, currency });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
