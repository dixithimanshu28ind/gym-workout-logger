import { getPayload, type Payload } from "payload";

import config from "@/payload.config";

/**
 * Memoized Payload Local API instance for use inside Next.js server code
 * (route handlers, server components, revalidation hooks). Local API calls
 * go straight to the database — no HTTP round trip to /api/payload/*.
 */
let payloadPromise: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config });
  }
  return payloadPromise;
}
