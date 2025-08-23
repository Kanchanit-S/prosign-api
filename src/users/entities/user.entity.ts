import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<CreateUserInput>;
