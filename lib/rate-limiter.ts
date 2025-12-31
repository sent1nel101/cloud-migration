/**
 * Rate Limiter Service
 * Implements token-bucket rate limiting for API endpoints
 * Stores limits in memory with optional persistence
 */

interface RateLimitConfig {
  maxRequests: number; // Number of requests allowed
  windowMs: number; // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit an identifier (IP, user ID, etc.)
 * Returns true if request allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(identifier);

  // Initialize or reset expired entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetTime - now);

  return { allowed, remaining, resetIn };
}

/**
 * Default rate limit config for roadmap generation
 * - 5 requests per hour for unauthenticated users
 * - 20 requests per hour for authenticated users
 */
export const ROADMAP_RATE_LIMITS = {
  unauthenticated: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  authenticated: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

/**
 * Get rate limit identifier from request
 * Uses user ID if authenticated, otherwise uses IP address
 */
export function getRateLimitIdentifier(
  userId: string | undefined,
  ipAddress: string
): string {
  return userId ? `user:${userId}` : `ip:${ipAddress}`;
}

/**
 * Extract client IP from request
 * Handles proxies and forwarded headers
 */
export function getClientIp(request: Request): string {
  // Check X-Forwarded-For (most common for proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Check X-Real-IP
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to localhost
  return "127.0.0.1";
}
