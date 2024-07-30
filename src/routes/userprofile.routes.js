import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/profile.controller.js'

const router = Router()

router.get('/profile', getProfile)
router.put('/profile/:id', updateProfile)

export default router
