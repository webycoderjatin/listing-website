-- Backwards-compatible nullable/defaulted additions. Existing accounts remain
-- usable only after an operator explicitly verifies them or sends a new code.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationCodeHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationSentAt" TIMESTAMP(3);
-- This migration is applied before the application version that requires OTP
-- login, so pre-existing accounts retain access. New registrations leave this
-- column null until a code is verified.
UPDATE "User" SET "emailVerifiedAt" = NOW() WHERE "emailVerifiedAt" IS NULL;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "tagline" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "businessType" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "yearEstablished" INTEGER;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "secondaryPhone" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "landmark" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "serviceAreas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "amenities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;
ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "isCover" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "duration" TEXT;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "group" TEXT;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BusinessHours" ADD COLUMN IF NOT EXISTS "allDay" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BusinessHours" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
