import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sendStatusUpdate } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} } } }
  )

  let status: string
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const body = await req.json()
    status = body.status
  } else {
    const formData = await req.formData()
    status = formData.get('status') as string
  }

  // Update order
  await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)

  // Fetch order + profile to send email
  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .eq('id', id)
    .single()

  if (order && order.profiles) {
    const profile = order.profiles as { full_name: string; email: string }
    if (profile.email && ['assigned','in_progress','review','completed'].includes(status)) {
      try {
        await sendStatusUpdate({ id: order.id, title: order.title, paper_type: order.paper_type, status }, profile.email, profile.full_name)
      } catch (e) {
        console.error('Email send failed:', e)
      }
    }
  }

  const isJson = contentType.includes('application/json')
  if (isJson) return NextResponse.json({ success: true })
  return NextResponse.redirect(new URL('/admin', req.url))
}
