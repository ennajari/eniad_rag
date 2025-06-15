export const metadata = {
  title: 'ENIAD RAG System',
  description: 'Système RAG avec Gemini',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}