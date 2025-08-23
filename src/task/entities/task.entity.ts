import { Task as PrismaTask } from '@prisma/client';

export type Task = PrismaTask;

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
