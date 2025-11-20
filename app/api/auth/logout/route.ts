import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST() {
  const refresh = cookies().get('refresh_token')?.value
  if (refresh) {
    await prisma.refreshToken.updateMany({ where: { token: refresh }, data: { revokedAt: new Date() } })
  }
  cookies().set('access_token', '', { httpOnly: true, path: '/', maxAge: 0 })
  cookies().set('refresh_token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return Response.json({ ok: true })
}
