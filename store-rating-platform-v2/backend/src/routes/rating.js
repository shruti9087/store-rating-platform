import express from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = express.Router()

router.post('/:storeId',
  body('value').isInt({ min: 1, max: 5 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    const storeId = Number(req.params.storeId)
    const { value } = req.body
    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } }
    })
    let rating
    if (existing) {
      rating = await prisma.rating.update({ where: { id: existing.id }, data: { value } })
    } else {
      rating = await prisma.rating.create({ data: { storeId, userId: req.user.id, value } })
    }
    res.json(rating)
  }
)

export default router
