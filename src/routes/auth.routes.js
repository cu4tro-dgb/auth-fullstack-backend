import { Router } from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
import { validateSchema } from '../middleware/validate-schema.js'
import { registerSchema } from '../schema/auth.schema.js'

const router = Router()

router.post('/login', login)
router.post('/register',validateSchema(registerSchema), register)
router.post('/logout', logout)

export default router
