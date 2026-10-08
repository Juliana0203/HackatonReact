import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hackaton',
  description:
    'Retos del hackathon: progress bar, timer, generador de contraseñas y formulario.',
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
