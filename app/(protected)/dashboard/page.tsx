"use client"

import { useEffect, useState } from 'react'

type Metrics = {
  projetosAtivos: number
  osPendentes: number
  tarefasCriticas: number
  alertasSST: number
  fluxoFinanceiro: number
}

type Activity = { id: string; message: string; createdAt: string }

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(setMetrics).catch(()=>{})
    const es = new EventSource('/api/queue')
    es.onmessage = (e) => {
      try {
        const a = JSON.parse(e.data)
        setActivities(prev => [a, ...prev].slice(0, 10))
      } catch {}
    }
    return () => es.close()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics ? (
          <>
            <Card title="Projetos ativos" value={metrics.projetosAtivos} />
            <Card title="OS pendentes" value={metrics.osPendentes} />
            <Card title="Tarefas cr?ticas" value={metrics.tarefasCriticas} />
            <Card title="Alertas SST" value={metrics.alertasSST} />
            <Card title="Fluxo financeiro (30d)" value={`R$ ${metrics.fluxoFinanceiro.toLocaleString('pt-BR')}`} />
          </>
        ) : (
          <div className="col-span-3">Carregando...</div>
        )}
      </div>

      <section>
        <h2 className="font-medium mb-2">Atividades recentes (tempo real)</h2>
        <ul className="space-y-2">
          {activities.map(a => (
            <li key={a.id} className="text-sm border rounded p-2 flex justify-between">
              <span>{a.message}</span>
              <span className="text-muted-foreground">{new Date(a.createdAt).toLocaleString('pt-BR')}</span>
            </li>
          ))}
          {!activities.length && <li className="text-sm text-muted-foreground">Sem eventos ainda.</li>}
        </ul>
      </section>
    </div>
  )
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
