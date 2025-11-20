"use client"

import { addDays, endOfMonth, format, getDay, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date())

  const weeks = useMemo(() => {
    const start = startOfMonth(current)
    const end = endOfMonth(current)
    const days: Date[] = []
    let d = addDays(start, -((getDay(start) + 6) % 7))
    while (d <= end || days.length % 7 !== 0) {
      days.push(d)
      d = addDays(d, 1)
    }
    return Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => days.slice(i*7, i*7+7))
  }, [current])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <button className="border rounded px-3 py-1" onClick={() => setCurrent(addDays(current, -30))}>?</button>
        <h1 className="text-xl font-semibold">{format(current, 'MMMM yyyy', { locale: ptBR })}</h1>
        <button className="border rounded px-3 py-1" onClick={() => setCurrent(addDays(current, 30))}>?</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {['Seg','Ter','Qua','Qui','Sex','S?b','Dom'].map((d) => (
          <div key={d} className="text-center text-muted-foreground">{d}</div>
        ))}
        {weeks.flat().map((day, i) => {
          const isCurrentMonth = day.getMonth() === current.getMonth()
          return (
            <div key={i} className={`border rounded p-2 min-h-[80px] ${isCurrentMonth ? '' : 'bg-neutral-50 text-neutral-400'}`}>
              <div className="text-xs mb-1">{format(day, 'd')}</div>
              {/* eventos poderiam ser renderizados aqui */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
