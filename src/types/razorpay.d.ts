declare module 'razorpay' {
  export = Razorpay;
  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(options: Record<string, unknown>): Promise<Record<string, unknown>>;
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
