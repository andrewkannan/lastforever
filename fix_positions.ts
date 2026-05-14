import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const notes = await prisma.memory.findMany({
    where: { type: 'note' }
  })
  
  for (const note of notes) {
    // stagger them slightly so they don't perfectly overlap
    const newX = 800 + Math.random() * 200
    const newY = 400 + Math.random() * 200
    
    await prisma.memory.update({
      where: { id: note.id },
      data: {
        posX: newX,
        posY: newY
      }
    })
    print(`Updated note ${note.id} to ${newX}, ${newY}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
