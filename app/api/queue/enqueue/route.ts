import { verifyAccessToken } from '@/lib/auth'
import { enqueueEvent } from '@/lib/queue'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload || payload.role !== 'ADMIN') return Response.json({ message: 'Somente ADMIN' }, { status: 403 })
  const body = await req.json().catch(() => ({}))
  const message = body?.message || 'Atividade'
  await enqueueEvent('activity', { message })
  return Response.json({ ok: true })
}
