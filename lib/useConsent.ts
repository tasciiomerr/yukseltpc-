"use client";

import { useSyncExternalStore } from "react";
import {
  type ConsentStatus,
  getStoredConsent,
  subscribeToConsent,
} from "./consent";

function subscribe(callback: () => void): () => void {
  return subscribeToConsent(() => callback());
}

function getServerSnapshot(): ConsentStatus {
  return "unknown";
}

export function useConsent(): ConsentStatus {
  return useSyncExternalStore(subscribe, getStoredConsent, getServerSnapshot);
}
