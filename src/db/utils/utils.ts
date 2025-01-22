import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";

const random: RandomReader = {
  read(bytes: Uint8Array): void {
    crypto.getRandomValues(bytes);
  },
};

export function generate8DigitsRandomString() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return generateRandomString(random, alphabet, 8);
}

/**
 *
 * @param time time in minutes @default 15
 * @returns
 */
export function createExpirationDate(time: number = 15) {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + time * 60 * 1000);
  return expirationDate;
}

export function isWithinExpirationDate(expirationDate: Date) {
  const currentDate = new Date();

  if (currentDate < expirationDate) {
    return true;
  } else {
    return false;
  }
}
