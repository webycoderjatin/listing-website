import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await req.json();

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Business not found or unauthorized" }, { status: 403 });
    }

    const amount = 39900; // ₹399.00 in paise
    const currency = "INR";

    const options = {
      amount: amount.toString(),
      currency,
      receipt: `rcpt_${businessId}_${Date.now()}`,
    };

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
