import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const SALT_ROUNDS = 10
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
  } catch (error) {
    console.error(error)
    throw new Error('Error hashing password')
  }
}

export async function comparePassword(password, hashPassword) {
  try {
    const match = await bcrypt.compare(password, hashPassword)
    return match
  } catch (error) {
    console.error(error)
    return false
  }
}
