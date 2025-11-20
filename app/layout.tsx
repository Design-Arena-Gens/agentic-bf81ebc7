import type { Metadata } from 'next'
import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'ANTech ? Plataforma de Gest?o Operacional',
  description: 'Gest?o operacional completa com seguran?a, auditoria e produtividade.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
