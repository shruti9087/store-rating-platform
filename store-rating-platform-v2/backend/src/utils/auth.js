import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export function authMiddleware(roles = [], allowGuest = false) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      if (allowGuest) return next()
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      const user = verifyToken(token)
      req.user = user
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden' })
      }
      next()
    } catch (e) {
      if (allowGuest) return next()
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
