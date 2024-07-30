import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { PORT } from './config.js'
import authRoutes from './routes/auth.routes.js'
import userProfileRoutes from './routes/userprofile.routes.js'

import { validateToken } from './middleware/validate-token.js'

const app = express()

app.use(morgan('dev'))
app.use(urlencoded({ extended: true }))
app.use(json()) // Esto debe estar antes de las rutas
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api', validateToken, userProfileRoutes)

app.listen(PORT, () => {
  console.log(`Server init on http://localhost:${PORT}`)
})
