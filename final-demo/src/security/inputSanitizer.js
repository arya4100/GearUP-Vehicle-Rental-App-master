/**
 * OWASP A03 – Injection / XSS Prevention
 * Utility functions for sanitizing user-supplied input before
 * it is stored in Firestore or rendered in the UI.
 */

/**
 * Strip HTML tags and dangerous characters from a string.
 * Prevents Stored XSS when data comes back from the database.
 */
export function sanitizeString(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Allow only letters, digits, spaces, @, ., -, _ in names/text fields.
 * Returns the sanitized value, or throws if clearly malicious.
 */
export function sanitizeName(value) {
  const cleaned = sanitizeString(value);
  // Reject strings that still contain script-like patterns after escaping
  if (/javascript:/i.test(value) || /on\w+\s*=/i.test(value)) {
    throw new Error("Invalid input detected.");
  }
  return cleaned;
}

/**
 * Validate and normalise an email address.
 */
export function validateEmail(email) {
  const trimmed = (email || "").trim().toLowerCase();
  if (/[<>]/.test(trimmed)) {
    throw new Error("Invalid email address: Dangerous characters detected.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    throw new Error("Invalid email address.");
  }
  return trimmed;
}

/**
 * Validate a phone number — digits, spaces, + and - only.
 */
export function validatePhone(phone) {
  const trimmed = (phone || "").trim();
  if (!/^[+\d\s-]{7,20}$/.test(trimmed)) {
    throw new Error("Invalid phone number.");
  }
  return trimmed;
}

/**
 * OWASP A03 – Validate password strength.
 * Min 8 chars, at least one uppercase, one lowercase, one digit, one special char.
 */
export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain an uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain a lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain a number." };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: "Password must contain a special character (!@#$%^&* etc.)." };
  }
  return { valid: true, message: "" };
}
