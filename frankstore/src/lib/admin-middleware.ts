import { NextResponse } from 'next/server'
import { requireAuth, type AuthUser } from './auth-middleware'

export function requireAdmin(request: Request): AuthUser | NextResponse {
  const result = requireAuth(request)
  if (result instanceof NextResponse) return result

  if (result.role !== 'admin') {
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
  }

  return result
}
