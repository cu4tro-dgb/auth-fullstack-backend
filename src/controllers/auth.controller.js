import { PrismaClient } from '@prisma/client'
import { generateToken } from '../utils/token.js'
import { comparePassword, hashPassword } from '../utils/password.js'

const prisma = new PrismaClient()

export async function register(req, res) {
  const { email, password, username, firstname, lastname } = req.body
  try {
    const userFound = await prisma.user.findFirst({ where: { email } })
    if (userFound) return res.status(400).json({ message: 'The user is already registered' })

    const passwordHash = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
        profile: {
          create: {
            firstname,
            lastname
          }
        }
      }
    })

    const { password: _, ...user } = newUser
    res.status(201).json(user)
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const userFound = await prisma.user.findFirst({ where: { email } })
    if (!userFound) return res.status(404).json({ message: 'User not found' })

    const match = await comparePassword(password, userFound.password) // Asegúrate de que comparePassword sea compatible con promesas
    if (!match) return res.status(400).json({ message: 'Email or password incorrect' })

    const token = await generateToken({ id: userFound.id })

    res.cookie('token', token)
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req, res) {
  res.cookie('token', '')
  res.status(200).json({ message: 'Logged out successfully' })
}
