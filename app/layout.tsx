import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grand Line Legends - One Piece TCG',
  description: 'Jeu de cartes à collectionner One Piece',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="fr">
      {}
      <body className="antialiased bg-slate-950 text-white min-h-screen">
      {}
      {children}
      </body>
      </html>
  )
}