import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(AppConfigService);
  const port = configService.app.port || 3000;
  
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${configService.app.environment}`);
  console.log(`📦 Version: ${configService.app.version}`);
}
bootstrap();
