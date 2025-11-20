"use client"

import { useEffect, useState } from 'react'

type User = { id: string; email: string; name: string; role: string; status: string }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('/api/users').then(r=>r.json()).then(setUsers).catch(()=>{})
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Usu?rios</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-neutral-50">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">E-mail</th>
            <th className="p-2 text-left">Papel</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
