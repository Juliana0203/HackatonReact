import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'R&M Explorer | Hackaton',
  description:
    'Explorador de personajes de Rick y Morty con herramientas interactivas.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
