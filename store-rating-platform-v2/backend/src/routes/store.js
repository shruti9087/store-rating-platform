import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  const { q = '' } = req.query
  const userId = req.user?.id
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: String(q), mode: 'insensitive' } },
        { address: { contains: String(q), mode: 'insensitive' } }
      ]
    },
    include: { ratings: true }
  })
  const response = stores.map(s => {
    const avg = s.ratings.length ? (s.ratings.reduce((a,b) => a + b.value, 0) / s.ratings.length) : null
    const my = userId ? s.ratings.find(r => r.userId === userId)?.value : null
    return { id: s.id, name: s.name, address: s.address, overallRating: avg, myRating: my }
  })
  res.json(response)
})

router.get('/owner/ratings', async (req, res) => {
  if (req.user?.role !== 'OWNER') return res.status(403).json({ error: 'Forbidden' })
  // find stores owned by user
  const stores = await prisma.store.findMany({ where: { owners: { some: { id: req.user.id } } } })
  if (stores.length === 0) return res.json({ average: null, users: [] })
  const storeIds = stores.map(s => s.id)
  const ratings = await prisma.rating.findMany({
    where: { storeId: { in: storeIds } },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  })
  const average = ratings.length ? ratings.reduce((a,b)=>a+b.value,0)/ratings.length : null
  res.json({ average, users: ratings.map(r => ({ id: r.user.id, name: r.user.name, email: r.user.email, rating: r.value })) })
})

export default router
