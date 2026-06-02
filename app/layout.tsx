import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyFlowHQ — Expert Academic Writing Service',
  description: 'Get expert help with essays, research papers, dissertations and more. Professional writers, on-time delivery, 100% original.',
  keywords: 'essay writing service, research paper help, academic writing, homework help',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
