import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import storeRoutes from './routes/store.js'
import ratingRoutes from './routes/rating.js'
import { authMiddleware } from './utils/auth.js'

dotenv.config()
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', authMiddleware(['ADMIN']), adminRoutes)
app.use('/api/stores', authMiddleware(['ADMIN','USER','OWNER'], true), storeRoutes)
app.use('/api/ratings', authMiddleware(['ADMIN','USER','OWNER'], true), ratingRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend running on :${PORT}`))
}

export default app
