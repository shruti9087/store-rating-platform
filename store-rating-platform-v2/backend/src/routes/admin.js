import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()
const passwordRule = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

router.get('/dashboard', async (req, res) => {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count()
  ])
  res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings })
})

router.post('/users',
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }).optional(),
  body('password').matches(passwordRule),
  body('role').isIn(['ADMIN','USER','OWNER']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, address, password, role } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, address, password: hash, role } })
    res.json({ id: user.id })
  }
)

router.get('/users', async (req, res) => {
  const { q = '', role } = req.query
  const where = {
    AND: [
      { OR: [
        { name: { contains: String(q), mode: 'insensitive' } },
        { email: { contains: String(q), mode: 'insensitive' } },
        { address: { contains: String(q), mode: 'insensitive' } }
      ] },
      role ? { role: String(role).toUpperCase() } : {}
    ]
  }
  const users = await prisma.user.findMany({
    where,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, address: true, role: true }
  })
  res.json(users)
})

router.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id)
  const user = await prisma.user.findUnique({
    where: { id },
    include: { ratings: true, stores: true }
  })
  if (!user) return res.status(404).json({ error: 'Not found' })
  let ownerRating = null
  if (user.role === 'OWNER') {
    // compute average across stores they own
    const storeIds = (user.stores || []).map(s => s.id)
    if (storeIds.length) {
      const agg = await prisma.rating.aggregate({ where: { storeId: { in: storeIds } }, _avg: { value: true } })
      ownerRating = agg._avg.value
    }
  }
  res.json({ ...user, ownerStoreAverage: ownerRating })
})

router.post('/stores',
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const store = await prisma.store.create({ data: req.body })
    res.json(store)
  }
)

router.get('/stores', async (req, res) => {
  const { q = '' } = req.query
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: String(q), mode: 'insensitive' } },
        { address: { contains: String(q), mode: 'insensitive' } }
      ]
    },
    include: { ratings: true },
    orderBy: { name: 'asc' }
  })
  const response = stores.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    rating: s.ratings.length ? (s.ratings.reduce((a,b) => a + b.value, 0) / s.ratings.length) : null
  }))
  res.json(response)
})

export default router
