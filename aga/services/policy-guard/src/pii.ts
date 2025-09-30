const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(\+?\d[\d\- ]{7,}\d)/g;
export function maskPII(input: string): string {
  return input.replace(EMAIL_RE, '[email‑redacted]').replace(PHONE_RE, '[phone‑redacted]');
}
