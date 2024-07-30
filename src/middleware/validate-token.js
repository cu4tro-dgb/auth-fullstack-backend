import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

export async function validateToken(req, res, next) {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ message: 'Access Denied. Token not provied.' })

  try {
    const payload = jwt.verify(token, SECRET_KEY)
    req.user = payload
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token not valid' })
  }
}
