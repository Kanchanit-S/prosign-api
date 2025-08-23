import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, CreateTaskInput, UpdateTaskInput } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const taskData: CreateTaskInput = {
      title: createTaskDto.title,
      description: createTaskDto.description || null,
      status: createTaskDto.status || 'pending',
      priority: createTaskDto.priority || 'medium',
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      userId,
    };

    return this.prisma.task.create({
      data: taskData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId?: number): Promise<Task[]> {
    const where = userId ? { userId } : {};
    
    return this.prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId?: number): Promise<Task> {
    const where = userId ? { id, userId } : { id };
    
    const task = await this.prisma.task.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId?: number): Promise<Task> {
    const where = userId ? { id, userId } : { id };
    
    // Check if task exists
    await this.findOne(id, userId);

    const taskData: UpdateTaskInput = {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      status: updateTaskDto.status,
      priority: updateTaskDto.priority,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
    };

    return this.prisma.task.update({
      where: { id },
      data: taskData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId?: number): Promise<void> {
    const where = userId ? { id, userId } : { id };
    
    // Check if task exists
    await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: { id },
    });
  }
}
