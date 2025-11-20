import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload) return Response.json({ message: 'N?o autenticado' }, { status: 401 })
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, status: true }, take: 20, orderBy: { createdAt: 'desc' } })
  return Response.json(users)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload || payload.role !== 'ADMIN') return Response.json({ message: 'Somente ADMIN' }, { status: 403 })
  const body = await req.json()
  const { email, name, password, role, status } = body || {}
  if (!email || !name || !password) return Response.json({ message: 'Dados incompletos' }, { status: 400 })
  // In real flow, hash password; here delegate to auth/register endpoint.
  return Response.json({ message: 'Use /api/auth/register para criar usu?rios' }, { status: 400 })
}
