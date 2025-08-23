import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

// Configuration
import { ConfigModule as CustomConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

// Prisma
import { PrismaModule } from './prisma/prisma.module';

// API Modules
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CustomConfigModule,
    PrismaModule,
    TaskModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
