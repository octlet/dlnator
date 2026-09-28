const encoder = new TextEncoder();

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export const SESSION_COOKIE = "dlnator_session";

export function isAuthEnabled() {
  return Boolean(process.env.AUTH_PASSWORD);
}

export async function getSessionToken() {
  const password = process.env.AUTH_PASSWORD;
  if (!password) return null;
  return sha256Hex(`dlnator-session:${password}`);
}

export function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}
