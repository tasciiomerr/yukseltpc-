export type ConsentStatus = "granted" | "denied" | "unknown";

const STORAGE_KEY = "yukseltpc-cookie-consent";
const EVENT_NAME = "yukseltpc:consent-change";

export function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "unknown";
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : "unknown";
}

export function setStoredConsent(status: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: status }));
}

export function subscribeToConsent(
  callback: (status: ConsentStatus) => void,
): () => void {
  function handler(event: Event) {
    callback((event as CustomEvent<ConsentStatus>).detail);
  }
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
