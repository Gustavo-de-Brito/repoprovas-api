import prisma from './src/databases/postgres';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
});

afterEach(async () => {
  await prisma.$disconnect();
});