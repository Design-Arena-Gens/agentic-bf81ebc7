import { createWorker } from '@/lib/queue'
import { prisma } from '@/lib/prisma'

async function main() {
  const { worker } = createWorker(async (name, data) => {
    if (name === 'activity') {
      await prisma.activity.create({ data: { message: data.message || 'Evento' } })
    }
  })

  worker.on('completed', (job) => console.log('completed', job.id))
  worker.on('failed', (job, err) => console.error('failed', job?.id, err))
}

main().catch((e) => { console.error(e); process.exit(1) })
