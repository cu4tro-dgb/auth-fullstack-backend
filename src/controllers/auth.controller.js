import { PrismaClient } from '@prisma/client'
import { generateToken } from '../utils/token.js'
import { comparePassword, hashPassword } from '../utils/password.js'

const prisma = new PrismaClient()

export async function register(req, res) {
  const { email, password, username, firstname, lastname, roles } = req.body
  try {
    const userFound = await prisma.user.findFirst({ where: { email } })
    if (userFound)
      return res.status(400).json({ message: 'The user is already registered' })

    const passwordHash = await hashPassword(password)

    const defaultRole = roles ?? ['user']

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
        },
        userRole: {
          create: defaultRole.map((role) => ({ Role: { connect: { name: role } } })),
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

    const match = await comparePassword(password, userFound.password)
    if (!match)
      return res.status(400).json({ message: 'Email or password incorrect' })

    const token = await generateToken({ id: userFound.id })

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
      })
      .json({ token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req, res) {
  res.clearCookie('token').json({ message: 'Logged out successfully' })
}
