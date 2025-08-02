import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

// Configuration
import { ConfigModule } from './config/config.module';

// API Modules
import { TaskModule } from './task/task.module';

@Module({
  imports: [ConfigModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
