declare module 'razorpay' {
  export = Razorpay;
  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(options: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
  }
}
