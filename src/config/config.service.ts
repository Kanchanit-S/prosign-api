import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app() {
    return {
      name: this.configService.get<string>('app.name'),
      version: this.configService.get<string>('app.version'),
      environment: this.configService.get<string>('app.environment'),
      port: this.configService.get<number>('app.port'),
      host: this.configService.get<string>('app.host'),
    };
  }

  get database() {
    return {
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      synchronize: this.configService.get<boolean>('database.synchronize'),
      logging: this.configService.get<boolean>('database.logging'),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    };
  }

  get redis() {
    return {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      db: this.configService.get<number>('redis.db'),
    };
  }

  get email() {
    return {
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.auth.user'),
        pass: this.configService.get<string>('email.auth.pass'),
      },
    };
  }

  get upload() {
    return {
      maxFileSize: this.configService.get<number>('upload.maxFileSize'),
      allowedMimeTypes: this.configService.get<string[]>('upload.allowedMimeTypes'),
      uploadPath: this.configService.get<string>('upload.uploadPath'),
    };
  }

  get cors() {
    return {
      origin: this.configService.get<string[]>('cors.origin'),
      credentials: this.configService.get<boolean>('cors.credentials'),
    };
  }

  get rateLimit() {
    return {
      windowMs: this.configService.get<number>('rateLimit.windowMs'),
      max: this.configService.get<number>('rateLimit.max'),
    };
  }

  get logging() {
    return {
      level: this.configService.get<string>('logging.level'),
      format: this.configService.get<string>('logging.format'),
    };
  }

  get security() {
    return {
      bcryptRounds: this.configService.get<number>('security.bcryptRounds'),
      sessionSecret: this.configService.get<string>('security.sessionSecret'),
    };
  }

  get isDevelopment(): boolean {
    return this.app.environment === 'development';
  }

  get isProduction(): boolean {
    return this.app.environment === 'production';
  }

  get isTest(): boolean {
    return this.app.environment === 'test';
  }
} 