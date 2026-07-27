import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from './prisma'

interface TokenPayload {
  userId: string
  email: string
  role: string
}

interface DecodedToken extends TokenPayload {
  iat: number
  exp: number
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está definido en las variables de entorno')
  return secret
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET no está definido en las variables de entorno')
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateAccessToken(user: TokenPayload): string {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '1h' }
  )
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex')
}

export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, getJwtSecret()) as DecodedToken
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, getJwtRefreshSecret()) as { userId: string }
    return decoded
  } catch {
    return null
  }
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  })

  return token
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } })
}

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/auth_token=([^;]+)/)
    if (match) return match[1]
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}
