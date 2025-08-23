# Authentication System

This module provides a complete authentication system using Passport + JWT with username and password authentication.

## Features

- User registration with password hashing
- User login with JWT token generation
- JWT token validation
- Protected routes with guards
- User profile endpoint

## API Endpoints

### POST /auth/register
Register a new user
```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST /auth/login
Login with username and password
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isAdmin": false
  }
}
```

### GET /auth/profile
Get user profile (requires JWT token)
```
Authorization: Bearer <jwt_token>
```

## Usage in Other Controllers

To protect routes with JWT authentication:

```typescript
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedData() {
    return 'This is protected data';
  }
}
```

## Environment Variables

Make sure to set these environment variables:

```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=prosign
DATABASE_SYNCHRONIZE=true
```

## Security Features

- Passwords are hashed using bcrypt with 12 rounds
- JWT tokens expire after 1 day by default
- Username uniqueness validation
- Email uniqueness validation (optional)
- Account activation status check
- Input validation with class-validator
