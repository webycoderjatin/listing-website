const MAX_SEARCH_LENGTH = 100;

export function readBoundedText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Keep image rendering aligned with the allowlist in next.config.ts. */
export function getSafeImageUrl(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com" ? value : fallback;
  } catch {
    return fallback;
  }
}

export function validateBusinessInput(input: Record<string, string>) {
  const values = {
    name: readBoundedText(input.name, 120),
    categoryId: readBoundedText(input.categoryId, 64),
    description: readBoundedText(input.description, 5_000),
    phone: readBoundedText(input.phone, 30),
    whatsapp: readBoundedText(input.whatsapp, 30),
    website: readBoundedText(input.website, 2_048),
    address: readBoundedText(input.address, 300),
    locality: readBoundedText(input.locality, 120),
    city: readBoundedText(input.city, 120),
    state: readBoundedText(input.state, 120),
    pincode: readBoundedText(input.pincode, 20),
  };

  if (!values.name || !values.categoryId || !values.description || !values.address || !values.locality || !values.city || !values.state || !values.pincode) {
    return { error: "Name, category, description, and all location fields are required." } as const;
  }
  if (values.name.length < 2) return { error: "Business name must be at least 2 characters." } as const;
  if (values.website && !isSafeHttpUrl(values.website.includes("://") ? values.website : `https://${values.website}`)) {
    return { error: "Enter a valid website URL." } as const;
  }
  if (values.phone && !/^[+()\d\s-]{7,30}$/.test(values.phone)) return { error: "Enter a valid phone number." } as const;
  if (values.whatsapp && !/^[+\d\s-]{7,30}$/.test(values.whatsapp)) return { error: "Enter a valid WhatsApp number." } as const;

  return { values } as const;
}

export function normalizeSearchParam(value: string | string[] | undefined) {
  const first = Array.isArray(value) ? value[0] : value;
  return readBoundedText(first, MAX_SEARCH_LENGTH);
}
