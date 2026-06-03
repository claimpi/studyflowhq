import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendStatusUpdate } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} } } }
    )

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file || !orderId) return NextResponse.json({ error: 'Missing file or orderId' }, { status: 400 })

    // Sanitize filename
    const ext = file.name.split('.').pop()
    const safeName = `${orderId}.${ext}`
    const filePath = `completed-papers/${safeName}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('papers')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) throw new Error(`Storage error: ${uploadError.message}`)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('papers')
      .getPublicUrl(filePath)

    // Update order in DB
    await supabase.from('orders').update({
      completed_file_url: publicUrl,
      completed_file_name: file.name,
      completed_at: new Date().toISOString(),
      status: 'completed',
      updated_at: new Date().toISOString(),
    }).eq('id', orderId)

    // Fetch order + client details to send email
    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .eq('id', orderId)
      .single()

    if (order) {
      const profile = order.profiles as { full_name: string; email: string } | null
      const clientEmail = profile?.email || order.billing_email || ''
      const clientName = profile?.full_name || order.billing_name || 'Student'

      if (clientEmail) {
        try {
          await sendPaperReady(order, clientEmail, clientName, publicUrl)
        } catch (e) {
          console.error('Email error:', e)
        }
      }
    }

    return NextResponse.json({ success: true, url: publicUrl, fileName: file.name })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Paper ready email
async function sendPaperReady(order: any, clientEmail: string, clientName: string, downloadUrl: string) {
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyflowhq.vercel.app'
  const FROM = process.env.RESEND_FROM_EMAIL || 'StudyFlowHQ <noreply@studyflowhq.com>'

  const html = `<!DOCTYPE html><html><body style="margin:0;background:#080f1e;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:#0e1a2e;border:1px solid rgba(0,229,255,0.2);border-radius:12px;padding:12px 24px;">
      <span style="font-size:18px;font-weight:800;color:#eef2f7;">StudyFlow<span style="color:#00E5FF;">HQ</span></span>
    </div>
  </div>
  <div style="background:#0e1a2e;border:1px solid rgba(0,255,135,0.2);border-radius:20px;padding:32px;margin-bottom:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h2 style="color:#00ff87;font-size:24px;font-weight:800;margin:0 0 8px;">Your Paper is Ready!</h2>
      <p style="color:#8892a4;font-size:14px;margin:0;">Hi ${clientName.split(' ')[0]}, your completed paper is available for download.</p>
    </div>
    <div style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.15);border-radius:12px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#8892a4;font-size:13px;width:40%;border-bottom:1px solid rgba(0,229,255,0.06);">Order</td><td style="padding:8px 0;color:#eef2f7;font-size:13px;font-weight:600;border-bottom:1px solid rgba(0,229,255,0.06);">#${order.id.substring(0,8).toUpperCase()}</td></tr>
        <tr><td style="padding:8px 0;color:#8892a4;font-size:13px;width:40%;border-bottom:1px solid rgba(0,229,255,0.06);">Paper</td><td style="padding:8px 0;color:#eef2f7;font-size:13px;font-weight:600;border-bottom:1px solid rgba(0,229,255,0.06);">${order.title?.substring(0,60)}</td></tr>
        <tr><td style="padding:8px 0;color:#8892a4;font-size:13px;">File</td><td style="padding:8px 0;color:#00ff87;font-size:13px;font-weight:600;">${order.completed_file_name}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${SITE_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#00ff87,#00cc6a);color:#080f1e;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:16px;margin-bottom:12px;">
        📥 Download Your Paper
      </a>
    </div>
    <div style="background:rgba(0,229,255,0.03);border-radius:10px;padding:14px;text-align:center;">
      <p style="color:#8892a4;font-size:12px;margin:0;">Need revisions? Reply to this email within <strong style="color:#eef2f7;">30 days</strong> and we'll fix it for free.</p>
    </div>
  </div>
  <div style="text-align:center;color:#8892a4;font-size:12px;">
    <p>© ${new Date().getFullYear()} StudyFlowHQ · <a href="${SITE_URL}" style="color:#00E5FF;">${SITE_URL}</a></p>
  </div>
</div></body></html>`

  return resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `🎉 Your Paper is Ready — Download Now | #${order.id.substring(0,8).toUpperCase()}`,
    html,
  })
}
