import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4),
  password: z.string().min(7).max(20),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  roles: z
    .string()
    .array()
    .nonempty()
    .refine(
      async (rolesBody) => {
        const rolesDatabase = await prisma.role.findMany({
          select: {
            name: true
          }
        })

        const rolesDatabase1 = await prisma.role.findMany({
          where: {
            name: {
              in: rolesBody.map((role) => role)
            }
          },
          select: {
            name: true
          }
        })

        console.log(rolesDatabase, rolesDatabase1)
        return rolesBody.every((role) =>
          rolesDatabase.some(({ name }) => name === role)
        )
      },
      {
        message: 'The roles entered do not exist',
        path: 'roles'
      }
    )
    .optional()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
