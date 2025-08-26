import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Logger } from '@nestjs/common';
import { WsAuthService } from '../users/services/ws-auth.service';

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true
  },
  namespace: '/tasks'
})
export class TaskGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TaskGateway.name);
  private connectedClients = new Map<string, { userId: number; socket: Socket }>();

  constructor(
    private readonly taskService: TaskService,
    private readonly wsAuthService: WsAuthService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Task WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract user ID from handshake auth
    const userId = await this.extractUserIdFromSocket(client);
    
    if (userId) {
      // Join user-specific room
      client.join(`user:${userId}`);
      this.connectedClients.set(client.id, { userId, socket: client });
      
      this.logger.log(`User ${userId} joined room user:${userId}`);
      
      // Send welcome message
      client.emit('connected', { 
        message: 'Connected to task service',
        userId,
        timestamp: new Date().toISOString()
      });
    } else {
      client.emit('error', { message: 'Authentication required' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  private async extractUserIdFromSocket(client: Socket): Promise<number | null> {
    const token = this.wsAuthService.extractTokenFromSocket(client);
    
    if (token) {
      const payload = await this.wsAuthService.validateToken(token);
      if (payload) {
        return payload.sub;
      }
    }
    
    // For development/testing, you can use a query parameter
    const userId = parseInt(client.handshake.query.userId as string);
    return isNaN(userId) ? null : userId;
  }

  @SubscribeMessage('createTask')
  async create(@MessageBody() createTaskDto: CreateTaskDto, @ConnectedSocket() client: Socket) {
    try {
      
      console.log('createTaskDto' ,createTaskDto)
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }


      const userId = clientInfo.userId;
      const task = await this.taskService.create(createTaskDto, userId);
      
      // Emit to the specific user's room
      this.server.to(`user:${userId}`).emit('taskCreated', {
        task,
        timestamp: new Date().toISOString()
      });
      
      // Send confirmation to the client
      client.emit('taskCreated', {
        task,
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Task created by user ${userId}: ${task.id}`);
      
    } catch (error) {
      this.logger.error('Error creating task:', error);
      client.emit('error', { 
        message: 'Failed to create task',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('findAllTasks')
  async findAll(@ConnectedSocket() client: Socket) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }

      const userId = clientInfo.userId;
      const tasks = await this.taskService.findAll();
      
      
      client.emit('tasksFound', {
        tasks,
        count: tasks.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      this.logger.error('Error fetching tasks:', error);
      client.emit('error', { 
        message: 'Failed to fetch tasks',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('findOneTask')
  async findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }

      const userId = clientInfo.userId;
      const task = await this.taskService.findOne(id, userId);
      
      client.emit('taskFound', {
        task,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      this.logger.error('Error fetching task:', error);
      client.emit('error', { 
        message: 'Failed to fetch task',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('updateTask')
  async update(@MessageBody() updateTaskDto: UpdateTaskDto, @ConnectedSocket() client: Socket) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }

      const userId = clientInfo.userId;
      const task = await this.taskService.update(updateTaskDto.id, updateTaskDto, userId);
      
      // Emit to the specific user's room
      this.server.to(`user:${userId}`).emit('taskUpdated', {
        task,
        timestamp: new Date().toISOString()
      });
      
      // Send confirmation to the client
      client.emit('taskUpdated', {
        task,
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Task updated by user ${userId}: ${task.id}`);
      
    } catch (error) {
      this.logger.error('Error updating task:', error);
      client.emit('error', { 
        message: 'Failed to update task',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('removeTask')
  async remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }

      const userId = clientInfo.userId;
      await this.taskService.remove(id, userId);
      
      // Emit to the specific user's room
      this.server.to(`user:${userId}`).emit('taskRemoved', {
        id,
        timestamp: new Date().toISOString()
      });
      
      // Send confirmation to the client
      client.emit('taskRemoved', {
        id,
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Task removed by user ${userId}: ${id}`);
      
    } catch (error) {
      this.logger.error('Error removing task:', error);
      client.emit('error', { 
        message: 'Failed to remove task',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('joinTaskRoom')
  async joinTaskRoom(@MessageBody() taskId: number, @ConnectedSocket() client: Socket) {
    try {
      const clientInfo = this.connectedClients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not authenticated' });
        return;
      }

      const userId = clientInfo.userId;
      
      // Verify user has access to this task
      const task = await this.taskService.findOne(taskId, userId);
      
      // Join task-specific room
      client.join(`task:${taskId}`);
      
      client.emit('joinedTaskRoom', {
        taskId,
        message: `Joined room for task: ${task.title}`,
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`User ${userId} joined task room: ${taskId}`);
      
    } catch (error) {
      this.logger.error('Error joining task room:', error);
      client.emit('error', { 
        message: 'Failed to join task room',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('leaveTaskRoom')
  async leaveTaskRoom(@MessageBody() taskId: number, @ConnectedSocket() client: Socket) {
    try {
      client.leave(`task:${taskId}`);
      
      client.emit('leftTaskRoom', {
        taskId,
        message: `Left room for task: ${taskId}`,
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Client ${client.id} left task room: ${taskId}`);
      
    } catch (error) {
      this.logger.error('Error leaving task room:', error);
      client.emit('error', { 
        message: 'Failed to leave task room',
        error: error.message 
      });
    }
  }

  // Method to broadcast task updates to all connected clients of a specific user
  async broadcastTaskUpdate(userId: number, event: string, data: any) {
    const userRoom = `user:${userId}`;
    this.server.to(userRoom).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Method to broadcast to a specific task room
  async broadcastToTaskRoom(taskId: number, event: string, data: any) {
    const taskRoom = `task:${taskId}`;
    this.server.to(taskRoom).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}
