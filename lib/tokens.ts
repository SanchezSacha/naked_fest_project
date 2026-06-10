import { randomBytes } from "crypto";

export function createToken() {
  return randomBytes(32).toString("hex");
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function getBaseUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  return `${url.protocol}//${url.host}`;
}
