# Environment Configuration Example

Create a `.env` file in your project root with the following variables:

```env
# Application settings
APP_NAME=ProSign API
APP_VERSION=1.0.0
NODE_ENV=development
PORT=3000
HOST=localhost

# JWT configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-change-this-in-production

# CORS configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
```

## Important Notes

1. **JWT_SECRET**: Change this to a strong, random string in production
2. **DATABASE_PASSWORD**: Use your actual PostgreSQL password
3. **DATABASE_SYNCHRONIZE**: Set to `false` in production
4. **CORS_ORIGIN**: Update with your frontend URLs
