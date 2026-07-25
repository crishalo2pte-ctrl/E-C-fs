import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword, generateToken, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'user' } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      if (!existingUser.passwordHash) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }
      const isValidPassword = await comparePassword(password, existingUser.passwordHash)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const token = generateToken(existingUser)
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          lastName: existingUser.lastName,
          email: existingUser.email,
          role: existingUser.role,
          level: existingUser.level,
          avatar: existingUser.avatar
        }
      })
    }

    const passwordHash = await hashPassword(password)
    
    const validRoles = ['user', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }

    const newUser = await prisma.user.create({
      data: {
        name: name || '',
        lastName: '',
        email,
        phone: '',
        passwordHash,
        role,
        status: 'activo',
        language: 'es',
        currency: 'ARS',
        level: 'Silver',
        registeredAt: new Date(),
        notifEmail: true,
        notifSms: false,
        notifPromotions: true,
        notifOrderUpdates: true,
        notifNewsletter: false
      }
    })

    const token = generateToken(newUser)
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        level: newUser.level,
        avatar: newUser.avatar
      }
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
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
        avatar: user.avatar
      }
    })
  } catch (error) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json(
      { message: 'No token provided' },
      { status: 400 }
    )
  }

  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }
    
    await prisma.user.delete({
      where: { id: decoded.userId }
    })

    const response = NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )

    response.cookies.delete('auth_token')
    
    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
