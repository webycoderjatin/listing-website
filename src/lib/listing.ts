/**
 * The annual listing price is stored and sent to Razorpay in the smallest
 * currency unit (paise). UI code must display LISTING_PRICE_RUPEES instead.
 */
export const LISTING_PRICE_RUPEES = 399;
export const LISTING_PRICE_PAISE = 39_900;
export const LISTING_CURRENCY = "INR" as const;

export const ADMIN_LISTING_TRANSITIONS = {
  PENDING_APPROVAL: ["APPROVED", "REJECTED"],
  APPROVED: ["SUSPENDED"],
} as const;

export type AdminListingTargetStatus = "APPROVED" | "REJECTED" | "SUSPENDED";

export function isExpectedListingPayment(amount: number, currency: string) {
  return amount === LISTING_PRICE_PAISE && currency === LISTING_CURRENCY;
}

export function canAdminTransitionListing(
  from: string,
  to: AdminListingTargetStatus,
) {
  return (ADMIN_LISTING_TRANSITIONS[from as keyof typeof ADMIN_LISTING_TRANSITIONS] ?? [])
    .includes(to as never);
}
