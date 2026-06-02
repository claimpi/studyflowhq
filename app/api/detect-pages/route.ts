import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    const buffer = Buffer.from(await file.arrayBuffer())
    let pages = 1
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const pdfText = buffer.toString('binary')
      const pageMatches = pdfText.match(/\/Type\s*\/Page[^s]/g)
      pages = pageMatches ? pageMatches.length : Math.max(1, Math.round(buffer.length / 51200))
    } else if (file.name.match(/\.(docx?|odt)$/i)) {
      pages = Math.max(1, Math.round(buffer.length / 20480))
    } else if (file.name.endsWith('.txt')) {
      pages = Math.max(1, Math.ceil(buffer.toString('utf-8').length / 3000))
    } else {
      pages = Math.max(1, Math.round(buffer.length / 40960))
    }
    pages = Math.min(pages, 500)
    return NextResponse.json({ pages, words: pages * 275, fileName: file.name, fileSize: file.size })
  } catch {
    return NextResponse.json({ error: 'Detection failed' }, { status: 500 })
  }
}
