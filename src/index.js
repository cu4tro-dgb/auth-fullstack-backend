import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { PORT } from './config.js'
import { validateToken } from './middleware/validate-token.js'

import authRoutes from './routes/auth.routes.js'
import userProfileRoutes from './routes/userprofile.routes.js'

const app = express()

app.use(morgan('dev'))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api', validateToken, userProfileRoutes)

app.listen(PORT, () => {
  console.log('Server listening on port', `http://localhost:${PORT}`)
})
