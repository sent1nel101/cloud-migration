import { checkRateLimit, ROADMAP_RATE_LIMITS, getRateLimitIdentifier, getClientIp } from '@/lib/rate-limiter'

describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within the limit', () => {
      const identifier = 'user-123'
      const config = ROADMAP_RATE_LIMITS.authenticated

      // First 20 requests should be allowed
      for (let i = 0; i < config.maxRequests; i++) {
        const result = checkRateLimit(identifier, config)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBeGreaterThanOrEqual(0)
      }
    })

    it('should deny requests exceeding the limit', () => {
      const identifier = 'user-123'
      const config = { maxRequests: 3, windowMs: 60 * 60 * 1000 }

      // Use up the limit
      for (let i = 0; i < config.maxRequests; i++) {
        checkRateLimit(identifier, config)
      }

      // Next request should be denied
      const result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(false)
    })

    it('should track separate limits for different identifiers', () => {
      const config = { maxRequests: 2, windowMs: 60 * 60 * 1000 }

      // User 1 uses their limit
      expect(checkRateLimit('user-1', config).allowed).toBe(true)
      expect(checkRateLimit('user-1', config).allowed).toBe(true)
      expect(checkRateLimit('user-1', config).allowed).toBe(false)

      // User 2 should have independent limit
      expect(checkRateLimit('user-2', config).allowed).toBe(true)
      expect(checkRateLimit('user-2', config).allowed).toBe(true)
      expect(checkRateLimit('user-2', config).allowed).toBe(false)
    })

    it('should return remaining requests count', () => {
      const identifier = 'user-123'
      const config = { maxRequests: 5, windowMs: 60 * 60 * 1000 }

      const result1 = checkRateLimit(identifier, config)
      // After 1st request: used=1, remaining=5-1=4
      expect(result1.remaining).toBeLessThanOrEqual(4)

      checkRateLimit(identifier, config)
      const result3 = checkRateLimit(identifier, config)
      // After 3rd request: used=3, remaining=5-3=2
      expect(result3.remaining).toBeLessThanOrEqual(2)
    })

    it('should return reset time', () => {
      const identifier = 'user-123'
      const config = { maxRequests: 5, windowMs: 60 * 60 * 1000 }

      const result = checkRateLimit(identifier, config)
      expect(result.resetIn).toBeGreaterThan(0)
      expect(result.resetIn).toBeLessThanOrEqual(60 * 60 * 1000)
    })
  })

  describe('getRateLimitIdentifier', () => {
    it('should return user identifier when user ID provided', () => {
      const userId = 'user-123'
      const ip = '192.168.1.1'

      const identifier = getRateLimitIdentifier(userId, ip)
      expect(identifier).toBe('user:user-123')
    })

    it('should return IP identifier when no user ID', () => {
      const ip = '192.168.1.1'

      const identifier = getRateLimitIdentifier(undefined, ip)
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('should prioritize user ID over IP', () => {
      const userId = 'user-456'
      const ip = '10.0.0.1'

      const identifier = getRateLimitIdentifier(userId, ip)
      expect(identifier).toContain('user:')
      expect(identifier).not.toContain('ip:')
    })
  })

  describe('getClientIp', () => {
    it('should be defined as utility function', () => {
      expect(getClientIp).toBeDefined()
      expect(typeof getClientIp).toBe('function')
    })
    
    // Note: Full getClientIp tests require Next.js Request objects
    // which are only available in integration tests with actual server context
  })

  describe('ROADMAP_RATE_LIMITS', () => {
    it('should define limits for unauthenticated users', () => {
      expect(ROADMAP_RATE_LIMITS.unauthenticated).toBeDefined()
      expect(ROADMAP_RATE_LIMITS.unauthenticated.maxRequests).toBe(5)
      expect(ROADMAP_RATE_LIMITS.unauthenticated.windowMs).toBe(60 * 60 * 1000)
    })

    it('should define limits for authenticated users', () => {
      expect(ROADMAP_RATE_LIMITS.authenticated).toBeDefined()
      expect(ROADMAP_RATE_LIMITS.authenticated.maxRequests).toBe(20)
      expect(ROADMAP_RATE_LIMITS.authenticated.windowMs).toBe(60 * 60 * 1000)
    })

    it('should have higher limits for authenticated users', () => {
      expect(ROADMAP_RATE_LIMITS.authenticated.maxRequests).toBeGreaterThan(
        ROADMAP_RATE_LIMITS.unauthenticated.maxRequests
      )
    })
  })

  describe('Real-world scenarios', () => {
    it('should handle authenticated user with 20 req/hour', () => {
      const userId = 'user-authenticated-123'
      const config = ROADMAP_RATE_LIMITS.authenticated

      // Simulate 20 requests
      for (let i = 0; i < 20; i++) {
        const result = checkRateLimit(userId, config)
        expect(result.allowed).toBe(true)
      }

      // 21st request should fail
      const result = checkRateLimit(userId, config)
      expect(result.allowed).toBe(false)
    })

    it('should handle unauthenticated user with 5 req/hour', () => {
      const ip = '192.168.1.1'
      const config = ROADMAP_RATE_LIMITS.unauthenticated

      // Simulate 5 requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(ip, config)
        expect(result.allowed).toBe(true)
      }

      // 6th request should fail
      const result = checkRateLimit(ip, config)
      expect(result.allowed).toBe(false)
    })

    it('should handle mixed authenticated and unauthenticated users', () => {
      const userId = 'user-mixed'
      const ipAddress = '192.168.2.1'

      // Auth user: 20 req/hr
      for (let i = 0; i < 20; i++) {
        expect(checkRateLimit(userId, ROADMAP_RATE_LIMITS.authenticated).allowed).toBe(true)
      }
      expect(checkRateLimit(userId, ROADMAP_RATE_LIMITS.authenticated).allowed).toBe(false)

      // Unauth user: 5 req/hr - should have independent limit
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(ipAddress, ROADMAP_RATE_LIMITS.unauthenticated).allowed).toBe(true)
      }
      expect(checkRateLimit(ipAddress, ROADMAP_RATE_LIMITS.unauthenticated).allowed).toBe(false)
    })
  })
})
