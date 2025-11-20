import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const [projetosAtivos, osPendentes, tarefasCriticas, alertasSST, fluxoDesp, fluxoRec] = await Promise.all([
    prisma.project.count({ where: { active: true } }),
    prisma.orderService.count({ where: { status: 'pending' } }),
    prisma.task.count({ where: { critical: true } }),
    prisma.alertSST.count({ where: { active: true } }),
    prisma.financialTxn.aggregate({ _sum: { amount: true }, where: { type: 'expense' } }),
    prisma.financialTxn.aggregate({ _sum: { amount: true }, where: { type: 'income' } })
  ])

  const fluxoFinanceiro = (fluxoRec._sum.amount || 0) - (fluxoDesp._sum.amount || 0)

  return Response.json({ projetosAtivos, osPendentes, tarefasCriticas, alertasSST, fluxoFinanceiro })
}
