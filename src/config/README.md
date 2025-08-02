# Configuration Setup

This directory contains the configuration setup for the ProSign API application.

## Files

- `configuration.ts` - Main configuration factory function
- `config.service.ts` - Type-safe configuration service
- `config.module.ts` - Configuration module for dependency injection

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Application Settings
```
APP_NAME=ProSign API
APP_VERSION=1.0.0
NODE_ENV=development
PORT=3000
HOST=localhost
```

### Database Configuration
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=prosign
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=true
```

### JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

### Redis Configuration
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### File Upload Configuration
```
MAX_FILE_SIZE=10485760
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain
UPLOAD_PATH=./uploads
```

### CORS Configuration
```
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Logging
```
LOG_LEVEL=info
LOG_FORMAT=json
```

### Security
```
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-change-this-in-production
```

## Usage

### In Services

```typescript
import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/config.service';

@Injectable()
export class MyService {
  constructor(private readonly configService: AppConfigService) {}

  someMethod() {
    const dbHost = this.configService.database.host;
    const jwtSecret = this.configService.jwt.secret;
    
    if (this.configService.isDevelopment) {
      console.log('Running in development mode');
    }
  }
}
```

### Environment Checks

```typescript
// Check current environment
if (this.configService.isDevelopment) {
  // Development-specific logic
}

if (this.configService.isProduction) {
  // Production-specific logic
}

if (this.configService.isTest) {
  // Test-specific logic
}
```

## Configuration Structure

The configuration is organized into logical sections:

- **app**: Application metadata and settings
- **database**: Database connection settings
- **jwt**: JWT authentication settings
- **redis**: Redis cache/session settings
- **email**: Email service settings
- **upload**: File upload settings
- **cors**: CORS settings
- **rateLimit**: Rate limiting settings
- **logging**: Logging configuration
- **security**: Security-related settings

## Environment Files Priority

The application loads environment variables in the following order:
1. `.env.local` (highest priority)
2. `.env`
3. System environment variables
4. Default values (lowest priority)

## Type Safety

All configuration values are type-safe through the `AppConfigService`. The service provides getter methods for each configuration section, ensuring compile-time type checking. 