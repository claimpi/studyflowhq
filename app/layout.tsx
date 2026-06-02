import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyFlowHQ — Professional Academic Writing Service',
  description: 'Upload your document, get an instant quote, and connect with expert writers. Fast, original, guaranteed.',
  keywords: 'essay writing service, academic writing, research paper help, dissertation assistance',
  openGraph: {
    title: 'StudyFlowHQ — Expert Academic Writing',
    description: 'Upload. Quote. Pay. Done.',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
