import { NextResponse } from 'next/server'
import { verifyAccessToken, getTokenFromRequest } from './auth'

export interface AuthUser {
  userId: string
  email: string
  role: string
}

export function requireAuth(request: Request): AuthUser | NextResponse {
  const token = getTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 })
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 })
  }

  return { userId: decoded.userId, email: decoded.email, role: decoded.role }
}
