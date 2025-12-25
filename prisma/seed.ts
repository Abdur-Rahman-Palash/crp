import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  // Check if users already exist
  const existingUsers = await prisma.user.count()
  if (existingUsers > 0) {
    console.log('Users already exist, skipping seed')
    return
  }

  console.log('Seeding database...')
  // Create test users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const accountantPassword = await bcrypt.hash('accountant123', 10)
  const teacherPassword = await bcrypt.hash('teacher123', 10)

  // Admin user
  const _admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'School Admin',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Accountant user
  const _accountant = await prisma.user.upsert({
    where: { email: 'accountant@school.com' },
    update: {},
    create: {
      email: 'accountant@school.com',
      name: 'School Accountant',
      password: accountantPassword,
      role: 'ACCOUNTANT'
    }
  })

  // Teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'John Smith',
      password: teacherPassword,
      role: 'TEACHER'
    }
  })

  // Create teacher profile
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      subjects: ['Mathematics', 'Physics']
    }
  })

  console.log('Test users created:')
  console.log('Admin: admin@school.com / admin123')
  console.log('Accountant: accountant@school.com / accountant123')
  console.log('Teacher: teacher@school.com / teacher123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })