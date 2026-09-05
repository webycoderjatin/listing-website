declare module 'razorpay' {
  export = Razorpay;
  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(options: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
    payments: {
      fetch(paymentId: string): Promise<{ id: string; order_id?: string; amount: number; currency: string; status: string }>;
    };
  }
}

interface RazorpayCheckout {
  open(): void;
  on(event: "payment.failed", callback: () => void): void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayCheckout;
  }
}

export {};
