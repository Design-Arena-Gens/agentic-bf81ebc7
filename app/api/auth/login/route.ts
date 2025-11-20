import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const MAX_FAILED = 5

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return Response.json({ message: 'Credenciais inv?lidas' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return Response.json({ message: 'Usu?rio ou senha inv?lidos' }, { status: 401 })

    if (user.status === 'BLOCKED' || user.failedLoginAttempts >= MAX_FAILED) {
      return Response.json({ message: 'Usu?rio bloqueado por tentativas' }, { status: 423 })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: { increment: 1 } } })
      await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN_FAILED', ip: req.ip ?? undefined, userAgent: req.headers.get('user-agent') ?? undefined } })
      return Response.json({ message: 'Usu?rio ou senha inv?lidos' }, { status: 401 })
    }

    const payload = { sub: user.id, role: user.role as any }
    const access = signAccessToken(payload)
    const refresh = signRefreshToken(payload)

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lastLoginAt: new Date() } }),
      prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt: new Date(Date.now() + 7*24*60*60*1000) } }),
      prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN_SUCCESS', ip: req.ip ?? undefined, userAgent: req.headers.get('user-agent') ?? undefined } })
    ])

    setAuthCookies(access, refresh)
    return Response.json({ ok: true })
  } catch (e: any) {
    logger.error({ err: e }, 'login error')
    return Response.json({ message: 'Erro no login' }, { status: 500 })
  }
}
