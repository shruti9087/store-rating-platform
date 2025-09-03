import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrator of The Platform   ', // ensure >20 chars
      email: 'admin@example.com',
      password: hash,
      role: 'ADMIN'
    }
  });
  const store = await prisma.store.upsert({
    where: { email: 'store@example.com' },
    update: {},
    create: {
      name: 'Sample Store for Demo 12345',
      email: 'store@example.com',
      address: '123 Demo Street'
    }
  });
  console.log({ admin: admin.email, store: store.name });
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>process.exit());
