import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskGateway } from './task.gateway';
import { TaskController } from './task.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TaskController],
  providers: [TaskGateway, TaskService],
})
export class TaskModule {}
