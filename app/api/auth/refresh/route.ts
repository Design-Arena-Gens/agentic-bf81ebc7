import { cookies } from 'next/headers'
import { verifyRefreshToken, signAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST() {
  const token = cookies().get('refresh_token')?.value
  if (!token) return Response.json({ message: 'Sem refresh' }, { status: 401 })
  const payload = verifyRefreshToken(token)
  if (!payload) return Response.json({ message: 'Inv?lido' }, { status: 401 })

  const exists = await prisma.refreshToken.findUnique({ where: { token } })
  if (!exists || exists.revokedAt || exists.expiresAt < new Date()) {
    return Response.json({ message: 'Expirado' }, { status: 401 })
  }
  const access = signAccessToken({ sub: payload.sub, role: payload.role })
  cookies().set('access_token', access, { httpOnly: true, path: '/', sameSite: 'lax', secure: true, maxAge: 60*15 })
  return Response.json({ ok: true })
}
