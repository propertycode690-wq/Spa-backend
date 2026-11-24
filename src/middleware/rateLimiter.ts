import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Middleware — P0 Security Fix
 *
 * Three tiers:
 * 1. loginLimiter:   Strict — 5 attempts per 15 minutes per IP (brute-force protection)
 * 2. authLimiter:    Moderate — 20 requests per 15 minutes per IP (sensitive auth endpoints)
 * 3. apiLimiter:     General — 100 requests per 1 minute per IP (general API protection)
 */

// Strict rate limit for login endpoint — prevents brute-force password attacks (relaxed in development)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 5, // Relaxed for local testing
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Only count failed attempts (4xx/5xx)
});

// Moderate rate limit for sensitive auth-related endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 5000 : 20, // Relaxed in dev
  message: {
    success: false,
    message: 'Too many requests to authentication endpoints. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit — protects all routes from abuse/DoS
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Relaxed in dev
  message: {
    success: false,
    message: 'Too many requests. Please slow down and try again in a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
