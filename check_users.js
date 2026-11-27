
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany({ take: 5, select: { id: true, email: true } });
    console.log('SAMPLE USERS:', JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Check error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
