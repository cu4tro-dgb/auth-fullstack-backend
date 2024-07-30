import { z } from 'zod'

export const registerSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  username: z.string()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
