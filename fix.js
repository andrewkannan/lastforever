const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const notes = await prisma.memory.findMany({ where: { type: 'note' } });
  for (const n of notes) {
     await prisma.memory.update({
       where: { id: n.id },
       data: { posX: 700 + Math.random() * 100, posY: 400 + Math.random() * 100 }
     });
     console.log('Fixed', n.id);
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
