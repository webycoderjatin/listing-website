export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalisePhoneForWhatsApp(value: string) {
  return value.replace(/\D/g, "");
}
