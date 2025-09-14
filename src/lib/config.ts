import { z } from 'zod'

// Environment variable validation schemas
const envSchema = z.object({
  // Database Configuration
  MONGODB_URI: z.string().url().startsWith('mongodb'),

  // Application Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXTAUTH_SECRET: z.string().min(10),
  NEXTAUTH_URL: z.string().url(),

  // JWT Configuration
  JWT_SECRET: z.string().min(10),
  JWT_ACCESS_TOKEN_EXPIRES: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES: z.string(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/),

  // Security
  ENABLE_RATE_LIMITING: z.string().transform((val: string) => val === 'true'),
  ENABLE_SECURITY_HEADERS: z.string().transform((val: string) => val === 'true'),

  // Optional configurations
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  REDIS_URL: z.string().optional(),
})

// Validate and parse environment variables
const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Environment variable validation failed:')
  parsedEnv.error.issues.forEach(error => {
    console.error(`- ${error.path.join('.')}: ${error.message}`)
  })
  throw new Error('Invalid environment configuration')
}

const config = {
  // Database
  mongodb: {
    uri: parsedEnv.data.MONGODB_URI,
  },

  // Application
  app: {
    nodeEnv: parsedEnv.data.NODE_ENV,
    nextAuth: {
      secret: parsedEnv.data.NEXTAUTH_SECRET,
      url: parsedEnv.data.NEXTAUTH_URL,
    },
  },

  // JWT
  jwt: {
    secret: parsedEnv.data.JWT_SECRET,
    refreshSecret: parsedEnv.data.JWT_SECRET + '_refresh', // Use different key for refresh
    accessTokenExpires: parsedEnv.data.JWT_ACCESS_TOKEN_EXPIRES,
    refreshTokenExpires: parsedEnv.data.JWT_REFRESH_TOKEN_EXPIRES,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(parsedEnv.data.RATE_LIMIT_WINDOW_MS),
    maxRequests: parseInt(parsedEnv.data.RATE_LIMIT_MAX_REQUESTS),
  },

  // Security
  security: {
    enableRateLimiting: parsedEnv.data.ENABLE_RATE_LIMITING,
    enableSecurityHeaders: parsedEnv.data.ENABLE_SECURITY_HEADERS,
  },

  // Optional services
  github: {
    clientId: parsedEnv.data.GITHUB_CLIENT_ID,
    clientSecret: parsedEnv.data.GITHUB_CLIENT_SECRET,
  },

  redis: {
    url: parsedEnv.data.REDIS_URL,
  },
}

// Freeze configuration object to prevent runtime modifications
Object.freeze(config.mongodb)
Object.freeze(config.app.nextAuth)
Object.freeze(config.app)
Object.freeze(config.jwt)
Object.freeze(config.rateLimit)
Object.freeze(config.security)
Object.freeze(config.github)
Object.freeze(config.redis)
Object.freeze(config)

export default config

// Export individual config sections for convenience
export const { mongodb, app, jwt, rateLimit, security, github, redis } = config
