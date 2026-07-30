import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword, generateAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken, revokeRefreshToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, lastName } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      if (!existingUser.passwordHash) {
        return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
      }

      const isValidPassword = await comparePassword(password, existingUser.passwordHash)
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
      }

      const accessToken = generateAccessToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      })
      const refreshToken = await createRefreshToken(existingUser.id)

      const response = NextResponse.json({
        success: true,
        token: accessToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          lastName: existingUser.lastName,
          email: existingUser.email,
          role: existingUser.role,
          level: existingUser.level,
          avatar: existingUser.avatar,
        },
      })

      response.cookies.set('auth_token', accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60,
      })
      response.cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      })

      if (existingUser.role === "admin") {
        response.cookies.set("admin_token", accessToken, {
          path: "/admin",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60,
        })
        response.cookies.set("admin_refresh_token", refreshToken, {
          path: "/admin",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        })
      }

      return response
    }

    if (!name) {
      return NextResponse.json({ message: 'El nombre es requerido para registrarse' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        name,
        lastName: lastName || '',
        email,
        phone: '',
        passwordHash,
        role: 'user',
        status: 'activo',
        language: 'es',
        currency: 'ARS',
        level: 'Silver',
        registeredAt: new Date(),
        notifEmail: true,
        notifSms: false,
        notifPromotions: true,
        notifOrderUpdates: true,
        notifNewsletter: false,
      },
    })

    const accessToken = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
    const refreshToken = await createRefreshToken(newUser.id)

    const response = NextResponse.json({
      success: true,
      token: accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        level: newUser.level,
        avatar: newUser.avatar,
      },
    })

    response.cookies.set('auth_token', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60,
    })
    response.cookies.set('refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  let token = request.cookies.get('auth_token')?.value

  if (!token) {
    const refreshToken = request.cookies.get('refresh_token')?.value
    if (refreshToken) {
      const rotated = await tryRefresh(refreshToken)
      if (rotated) return rotated
    }
    return NextResponse.json({ user: null }, { status: 401 })
  }

  let decoded = verifyAccessToken(token)
  if (!decoded) {
    const refreshToken = request.cookies.get('refresh_token')?.value
    if (refreshToken) {
      const rotated = await tryRefresh(refreshToken)
      if (rotated) return rotated
    }
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  })

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 })
  }

  return NextResponse.json({
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
}

async function tryRefresh(refreshToken: string): Promise<NextResponse | null> {
  const decoded = verifyRefreshToken(refreshToken)
  if (!decoded) return null

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })
  if (!stored) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  })
  if (!user) return null

  await revokeRefreshToken(refreshToken)

  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
  const newRefreshToken = await createRefreshToken(user.id)

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      level: user.level,
      avatar: user.avatar,
    },
    token: newAccessToken,
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
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 400 })
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
  }

  if (refreshToken) {
    await revokeRefreshToken(refreshToken)
  }

  await prisma.refreshToken.deleteMany({ where: { userId: decoded.userId } })

  const response = NextResponse.json({ message: 'Sesión cerrada' }, { status: 200 })
  response.cookies.delete('auth_token')
  response.cookies.delete('refresh_token')

  return response
}
