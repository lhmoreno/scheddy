import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: {
      slug: 'test',
    },
    create: {
      name: 'John Doe',
      email: 'john@doe.com',
      slug: 'test',
    },
    update: {
      name: 'John Doe',
      email: 'john@doe.com',
      slug: 'test',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
