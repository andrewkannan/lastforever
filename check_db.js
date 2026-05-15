const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.memory.count({where: {imageBase64: {not: null}}});
  console.log('Base64 left:', count);
  const s3 = await prisma.memory.count({where: {imageUrl: {not: null}}});
  console.log('S3 count:', s3);
  
  const memories = await prisma.memory.findMany({
    select: { id: true, type: true, imageBase64: true, imageUrl: true }
  });
  
  for (const m of memories) {
    if (m.imageBase64 && m.imageBase64.length > 50) {
      console.log(`[${m.type}] ${m.id} has imageBase64 starting with: ${m.imageBase64.substring(0, 50)}...`);
    } else if (m.imageUrl) {
      console.log(`[${m.type}] ${m.id} has imageUrl: ${m.imageUrl}`);
    } else {
      console.log(`[${m.type}] ${m.id} has NO image data`);
    }
  }
}

main();
