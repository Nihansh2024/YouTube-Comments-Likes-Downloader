import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@commentflow.com' },
    update: {},
    create: {
      email: 'admin@commentflow.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create subscription for admin
  await prisma.subscription.upsert({
    where: { userId: admin.id },
    update: { plan: 'PRO' },
    create: {
      userId: admin.id,
      plan: 'PRO',
    },
  });

  console.log('Admin user created:');
  console.log('Email: admin@commentflow.com');
  console.log('Password: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
