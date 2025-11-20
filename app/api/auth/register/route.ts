import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name, password, role } = body || {}
  if (!email || !name || !password) return Response.json({ message: 'Dados incompletos' }, { status: 400 })

  const count = await prisma.user.count()
  if (count > 0) {
    const token = req.cookies.get('access_token')?.value
    const payload = token ? verifyAccessToken(token) : null
    if (!payload || payload.role !== 'ADMIN') return Response.json({ message: 'Somente ADMIN' }, { status: 403 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, name, passwordHash, role: (role || 'COLABORADOR') } })
  return Response.json({ id: user.id, email: user.email })
}
