import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateProfile(req, res) {
  const {id} = req.params
  const { firstname, lastname, bio } = req.body
 
  try {
    const updateProfile = await prisma.profile.update({
      data: {
        firstname,
        lastname,
        bio
      },
      where: { userId: id }
    })
  
    res.status(200).json(updateProfile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error internal server' })
  }
}

export async function getProfile(req, res) {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        userId: req.user.id
      }
    })
    res.status(200).json(profile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error internal server' })
  }
}
