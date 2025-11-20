import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      const interval = setInterval(async () => {
        const a = await prisma.activity.create({ data: { message: 'Atualiza??o de sistema' } })
        send({ id: a.id, message: a.message, createdAt: a.createdAt })
      }, 7000)

      const hello = { id: 'boot', message: 'Feed iniciado', createdAt: new Date().toISOString() }
      send(hello)

      const notifyClose = () => {
        clearInterval(interval)
        controller.close()
      }

      // close after 2 minutes to avoid hanging during tests
      setTimeout(notifyClose, 120000)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}
