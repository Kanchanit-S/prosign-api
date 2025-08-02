import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: AppConfigService) {}

  getHello(): string {
    return `Hello from ${this.configService.app.name} v${this.configService.app.version}!`;
  }

  getAppInfo() {
    return {
      name: this.configService.app.name,
      version: this.configService.app.version,
      environment: this.configService.app.environment,
      port: this.configService.app.port,
    };
  }

  getDatabaseInfo() {
    return {
      host: this.configService.database.host,
      port: this.configService.database.port,
      database: this.configService.database.database,
    };
  }
}
