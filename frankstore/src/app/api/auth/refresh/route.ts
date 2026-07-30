import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyRefreshToken,
  generateAccessToken,
  createRefreshToken,
  revokeRefreshToken,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const refreshToken =
      request.cookies.get('refresh_token')?.value ||
      request.cookies.get('admin_refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
    }

    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      return NextResponse.json({ message: 'Refresh token inválido o expirado' }, { status: 401 })
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })
    if (!stored) {
      return NextResponse.json({ message: 'Refresh token revocado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    await revokeRefreshToken(refreshToken)

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    const newRefreshToken = await createRefreshToken(user.id)

    const response = NextResponse.json({
      token: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        level: user.level,
        avatar: user.avatar,
      },
    })

    response.cookies.set('auth_token', newAccessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60,
    })
    response.cookies.set('refresh_token', newRefreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    if (user.role === 'admin') {
      response.cookies.set('admin_token', newAccessToken, {
        path: '/admin',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60,
      })
      response.cookies.set('admin_refresh_token', newRefreshToken, {
        path: '/admin',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return response
  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
