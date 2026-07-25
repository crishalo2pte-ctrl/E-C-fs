import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface DecodedToken {
  userId: string
  email: string
  role: string
  exp: number
}

interface User {
  id: string
  name: string
  lastName: string
  email: string
  role: string
  passwordHash: string
  level: string
  avatar: string
  status: string
  language: string
  currency: string
  notifEmail: boolean
  notifSms: boolean
  notifPromotions: boolean
  notifOrderUpdates: boolean
  notifNewsletter: boolean
  registeredAt: Date
  lastLoginAt?: Date
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  const secret = process.env.JWT_SECRET || 'frankstore-secret-key-2024'
  
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '8h' }
  )
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const secret = process.env.JWT_SECRET || 'frankstore-secret-key-2024'
    return jwt.verify(token, secret) as DecodedToken
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: any): string | null {
  if (request.headers && request.headers.cookie) {
    const cookies = request.headers.cookie
    const tokenMatch = cookies.match(/auth_token=([^;]+)/)
    if (tokenMatch) {
      return tokenMatch[1]
    }
  }
  
  return null
}

export function createAuthHeaders(token: string): Headers {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  return headers
}
