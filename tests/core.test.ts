import assert from "node:assert/strict";
import test from "node:test";
import {
  LISTING_CURRENCY,
  LISTING_PRICE_PAISE,
  LISTING_PRICE_RUPEES,
  canAdminTransitionListing,
  isExpectedListingPayment,
} from "../src/lib/listing";
import { normalizeSearchParam, validateBusinessInput } from "../src/lib/validation";

test("listing price has one integer source of truth", () => {
  assert.equal(LISTING_PRICE_RUPEES, 399);
  assert.equal(LISTING_PRICE_PAISE, 39_900);
  assert.equal(LISTING_CURRENCY, "INR");
  assert.equal(isExpectedListingPayment(39_900, "INR"), true);
  assert.equal(isExpectedListingPayment(399, "INR"), false);
  assert.equal(isExpectedListingPayment(39_900, "USD"), false);
});

test("listing state transitions prohibit approval before payment verification", () => {
  assert.equal(canAdminTransitionListing("PENDING_PAYMENT", "APPROVED"), false);
  assert.equal(canAdminTransitionListing("PENDING_APPROVAL", "APPROVED"), true);
  assert.equal(canAdminTransitionListing("APPROVED", "SUSPENDED"), true);
  assert.equal(canAdminTransitionListing("REJECTED", "APPROVED"), false);
});

test("business validation rejects unsafe and malformed inputs", () => {
  const common = {
    name: "Joe's Plumbing", categoryId: "category", description: "Reliable plumbing services.",
    phone: "+91 9876543210", whatsapp: "919876543210", address: "12 Main Street",
    locality: "Central", city: "Mohali", state: "Punjab", pincode: "160062",
  };
  assert.deepEqual(validateBusinessInput({ ...common, website: "javascript:alert(1)" }), { error: "Enter a valid website URL." });
  assert.deepEqual(validateBusinessInput({ ...common, website: "https://example.com" }).values?.name, "Joe's Plumbing");
});

test("search parameters are trimmed, capped, and use a single value", () => {
  assert.equal(normalizeSearchParam(["  dentist  ", "ignored"]), "dentist");
  assert.equal(normalizeSearchParam("x".repeat(101)).length, 100);
});
