import { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { computeSignatureHash, registerSignature } from '@/lib/signature'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload) return Response.json({ message: 'N?o autenticado' }, { status: 401 })

  const body = await req.json()
  const { targetType, targetId, data } = body || {}
  if (!targetType || !targetId || !data) return Response.json({ message: 'Dados inv?lidos' }, { status: 400 })
  const hash = computeSignatureHash(data)
  const sig = await registerSignature(payload.sub, targetType, targetId, hash)
  return Response.json({ id: sig.id, hash: sig.hash, createdAt: sig.createdAt })
}
