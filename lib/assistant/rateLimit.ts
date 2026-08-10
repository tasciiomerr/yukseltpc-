/**
 * Basit, bellek-içi (in-memory) sabit pencereli rate limiter.
 *
 * Not: Vercel gibi serverless ortamlarda her fonksiyon örneği kendi
 * belleğini tutar — bu yüzden bu limit "tam" değil, örnekler arasında
 * paylaşılmaz. Amaç kötüye kullanımı tamamen engellemek değil, API
 * maliyetini makul bir sınırda tutmaktır. Kalıcı/paylaşılan bir limit
 * gerekirse ileride Supabase veya Redis tabanlı bir sayaca geçilebilir.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count < MAX_REQUESTS_PER_WINDOW) {
    bucket.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.ceil(
    (bucket.windowStart + WINDOW_MS - now) / 1000,
  );
  return { allowed: false, retryAfterSeconds };
}
