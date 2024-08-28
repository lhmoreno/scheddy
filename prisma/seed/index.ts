import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.service.deleteMany()
  await prisma.availability.deleteMany()

  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    create: {
      name: 'John Doe',
      email: 'john@doe.com',
      slug: 'test',
      availabilities: {
        createMany: {
          data: [
            { weekDay: 1, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 2, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 3, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
          ],
        },
      },
      services: {
        createMany: {
          data: [
            { name: 'Service example 1', timeInMinutes: 120 },
            { name: 'Service example 2', timeInMinutes: 30 },
          ],
        },
      },
    },
    update: {
      name: 'John Doe',
      email: 'john@doe.com',
      slug: 'test',
      availabilities: {
        createMany: {
          data: [
            { weekDay: 1, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 2, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 3, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
          ],
        },
      },
      services: {
        createMany: {
          data: [
            { name: 'Service example 1', timeInMinutes: 120 },
            { name: 'Service example 2', timeInMinutes: 30 },
          ],
        },
      },
    },
  })

  await prisma.user.update({
    where: {
      email: process.env.EMAIL,
    },
    data: {
      availabilities: {
        createMany: {
          data: [
            { weekDay: 1, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 2, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 3, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 4, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 5, startTimeInMinutes: 540, endTimeInMinutes: 1080 },
            { weekDay: 6, startTimeInMinutes: 540, endTimeInMinutes: 720 },
          ],
        },
      },
      services: {
        createMany: {
          data: [
            { name: 'Service example 1', timeInMinutes: 105 },
            { name: 'Service example 2', timeInMinutes: 15 },
            { name: 'Service example 3', timeInMinutes: 75 },
          ],
        },
      },
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
