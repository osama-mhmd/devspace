import type { User } from "lucia";
import {
  createExpirationDate,
  isWithinExpirationDate,
  generate8DigitsRandomString,
} from "./utils";

export function generateEmailVerificationCode(): {
  verificationCode: string;
  expiresAt: string;
} {
  const verificationCode = generate8DigitsRandomString();
  const expiresAtDate = createExpirationDate();
  const expiresAt = expiresAtDate.toJSON();

  return {
    verificationCode,
    expiresAt,
  };
}

export function verifyVerificationCode(user: User, inputCode: string): boolean {
  const [expiresAt, code] = user.emailVerified.split("=");

  const expiresAtDate = new Date(expiresAt);

  if (inputCode !== code) {
    return false;
  }

  if (!isWithinExpirationDate(expiresAtDate)) {
    return false;
  }

  return true;
}
