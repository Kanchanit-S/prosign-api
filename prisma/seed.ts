import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      email: 'admin@prosign.com',
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      isActive: true,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      email: 'user@prosign.com',
      firstName: 'Regular',
      lastName: 'User',
      isAdmin: false,
      isActive: true,
    },
  });

  // Create sample tasks
  const task1 = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Complete project setup',
      description: 'Set up the initial project structure and configuration',
      status: 'completed',
      priority: 'high',
      userId: admin.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Review code',
      description: 'Review the implemented features and provide feedback',
      status: 'pending',
      priority: 'medium',
      userId: user.id,
    },
  });

  const task3 = await prisma.task.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Write documentation',
      description: 'Create comprehensive documentation for the API',
      status: 'in_progress',
      priority: 'low',
      userId: admin.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user:', admin.username);
  console.log('👤 Regular user:', user.username);
  console.log('📋 Sample tasks created:', [task1.title, task2.title, task3.title]);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
