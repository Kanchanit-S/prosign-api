export default () => ({
  // Application settings
  app: {
    name: process.env.APP_NAME || 'ProSign API',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10) || 3000,
    host: process.env.HOST || 'localhost',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || `postgresql://${process.env.DATABASE_USERNAME || 'postgres'}:${process.env.DATABASE_PASSWORD || 'password'}@${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || '5432'}/${process.env.DATABASE_NAME || 'prosign'}`,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // // Redis configuration (for caching/sessions)
  // redis: {
  //   host: process.env.REDIS_HOST || 'localhost',
  //   port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
  //   password: process.env.REDIS_PASSWORD || null,
  //   db: parseInt(process.env.REDIS_DB || '0', 10) || 0,
  // },

  // // Email configuration
  // email: {
  //   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  //   port: parseInt(process.env.EMAIL_PORT || '587', 10) || 587,
  //   secure: process.env.EMAIL_SECURE === 'true' || false,
  //   auth: {
  //     user: process.env.EMAIL_USER || '',
  //     pass: process.env.EMAIL_PASS || '',
  //   },
  // },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
    ],
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  },

  // // Rate limiting
  // rateLimit: {
  //   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) || 15 * 60 * 1000, // 15 minutes
  //   max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) || 100, // limit each IP to 100 requests per windowMs
  // },

  // Logging
  // logging: {
  //   level: process.env.LOG_LEVEL || 'info',
  //   format: process.env.LOG_FORMAT || 'json',
  // },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  },
});