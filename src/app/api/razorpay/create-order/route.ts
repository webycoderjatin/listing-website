import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await req.json() as { businessId?: string };
    if (!businessId) {
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

    const amount = 39900; // ₹399.00 in paise
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `rcpt_${businessId.substring(0, 20)}`,
    };

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        businessId,
        razorpayOrderId: order.id as string,
        amount,
        currency,
        status: "PENDING",
      }
    });

    return NextResponse.json({ orderId: order.id, amount, currency });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
