import express from 'express'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { signToken } from '../utils/auth.js'
const prisma = new PrismaClient()
const router = express.Router()
const passwordRule = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

router.post('/register',
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }).optional(),
  body('password').matches(passwordRule),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, address, password } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, address, password: hash, role: 'USER' } })
    const token = signToken({ id: user.id, role: user.role, email: user.email })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  })

router.post('/login',
  body('email').isEmail(),
  body('password').isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = signToken({ id: user.id, role: user.role, email: user.email })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  })

router.post('/password', 
  body('password').matches(passwordRule),
  async (req, res) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' })
    const token = req.headers.authorization.split(' ')[1]
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const userId = payload.id
    const { password } = req.body
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hash } })
    res.json({ status: 'ok' })
  })

export default router
