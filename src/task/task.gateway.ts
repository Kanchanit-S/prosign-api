import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@WebSocketGateway()
export class TaskGateway {
  constructor(private readonly taskService: TaskService) {}

  @SubscribeMessage('createTask')
  create(@MessageBody() createTaskDto: CreateTaskDto, @ConnectedSocket() client: Socket) {
    // Note: In WebSocket context, you might need to implement user authentication differently
    // For now, we'll use a default userId or implement proper WebSocket authentication
    const userId = 1; // This should come from authenticated WebSocket connection
    return this.taskService.create(createTaskDto, userId);
  }

  @SubscribeMessage('findAllTask')
  findAll(@ConnectedSocket() client: Socket) {
    // Note: In WebSocket context, you might need to implement user authentication differently
    const userId = 1; // This should come from authenticated WebSocket connection
    return this.taskService.findAll(userId);
  }

  @SubscribeMessage('findOneTask')
  findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    // Note: In WebSocket context, you might need to implement user authentication differently
    const userId = 1; // This should come from authenticated WebSocket connection
    return this.taskService.findOne(id, userId);
  }

  @SubscribeMessage('updateTask')
  update(@MessageBody() updateTaskDto: UpdateTaskDto, @ConnectedSocket() client: Socket) {
    // Note: In WebSocket context, you might need to implement user authentication differently
    const userId = 1; // This should come from authenticated WebSocket connection
    return this.taskService.update(updateTaskDto.id, updateTaskDto, userId);
  }

  @SubscribeMessage('removeTask')
  remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    // Note: In WebSocket context, you might need to implement user authentication differently
    const userId = 1; // This should come from authenticated WebSocket connection
    return this.taskService.remove(id, userId);
  }
}
