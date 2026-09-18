export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}
export function isRequired(v: string): boolean {
  return v.trim().length > 0;
}
export function minLen(v: string, n: number): boolean {
  return v.trim().length >= n;
}
