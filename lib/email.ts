// Lazy Resend initialization — only fails at send time, not at module load
function getResend() {
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

const ADMIN_EMAIL = 'info@studyflowhq.com'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'StudyFlowHQ <noreply@studyflowhq.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyflowhq.vercel.app'

function baseTemplate(content: string, title: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#080f1e;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:#0e1a2e;border:1px solid rgba(0,229,255,0.2);border-radius:12px;padding:12px 24px;">
      <span style="font-size:18px;font-weight:800;color:#eef2f7;">StudyFlow<span style="color:#00E5FF;">HQ</span></span>
    </div>
  </div>
  <div style="background:#0e1a2e;border:1px solid rgba(0,229,255,0.15);border-radius:20px;padding:32px;margin-bottom:24px;">${content}</div>
  <div style="text-align:center;color:#8892a4;font-size:12px;">
    <p>© ${new Date().getFullYear()} StudyFlowHQ · <a href="${SITE_URL}" style="color:#00E5FF;">${SITE_URL}</a></p>
  </div>
</div></body></html>`
}

function row(label: string, value: string) {
  return `<tr><td style="padding:8px 0;color:#8892a4;font-size:13px;width:40%;border-bottom:1px solid rgba(0,229,255,0.06);">${label}</td><td style="padding:8px 0;color:#eef2f7;font-size:13px;font-weight:600;border-bottom:1px solid rgba(0,229,255,0.06);">${value}</td></tr>`
}

export async function sendNewOrderAdmin(order: {
  id: string; title: string; paper_type: string; subject: string
  academic_level: string; pages: number; deadline: string; price: number
  instructions?: string; user_email?: string; user_name?: string
}) {
  const deadline = new Date(order.deadline).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })
  const levelMap: Record<string, string> = { high_school: 'High School', undergraduate: 'Undergraduate', masters: "Master's", phd: 'PhD' }

  const content = `
    <h2 style="color:#00E5FF;font-size:22px;font-weight:800;margin:0 0 8px;">🆕 New Order Received</h2>
    <p style="color:#8892a4;font-size:14px;margin:0 0 24px;">A new paid order requires writer assignment.</p>
    <div style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.15);border-radius:12px;padding:20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Order ID', order.id.substring(0,8).toUpperCase())}
        ${row('Client', order.user_name || order.user_email || 'Guest')}
        ${row('Email', order.user_email || '—')}
        ${row('Type', order.paper_type)}
        ${row('Subject', order.subject)}
        ${row('Level', levelMap[order.academic_level] || order.academic_level)}
        ${row('Pages', `${order.pages} (${order.pages * 275} words)`)}
        ${row('Deadline', deadline)}
        ${row('Amount', `$${order.price.toFixed(2)} USD`)}
      </table>
    </div>
    <div style="background:rgba(0,229,255,0.03);border-radius:10px;padding:16px;margin-bottom:${order.instructions ? '16px' : '24px'};">
      <p style="color:#8892a4;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Title</p>
      <p style="color:#eef2f7;font-size:14px;font-weight:600;margin:0;">${order.title}</p>
    </div>
    ${order.instructions ? `<div style="background:rgba(0,229,255,0.03);border-radius:10px;padding:16px;margin-bottom:24px;"><p style="color:#8892a4;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Instructions</p><p style="color:#c4cdd8;font-size:13px;margin:0;line-height:1.6;">${order.instructions.substring(0,500)}</p></div>` : ''}
    <a href="${SITE_URL}/admin" style="display:block;background:linear-gradient(135deg,#00E5FF,#00b8cc);color:#080f1e;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;">Open Admin Dashboard →</a>`

  return getResend().emails.send({
    from: FROM_EMAIL, to: ADMIN_EMAIL,
    subject: `🆕 New Order: ${order.paper_type} — ${order.title.substring(0,50)}`,
    html: baseTemplate(content, 'New Order — StudyFlowHQ'),
  })
}

export async function sendOrderConfirmation(order: {
  id: string; title: string; paper_type: string; pages: number; deadline: string; price: number; academic_level: string
}, clientEmail: string, clientName: string) {
  const deadline = new Date(order.deadline).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })

  const content = `
    <h2 style="color:#00ff87;font-size:22px;font-weight:800;margin:0 0 8px;">✅ Order Confirmed!</h2>
    <p style="color:#8892a4;font-size:14px;margin:0 0 24px;">Hi ${clientName.split(' ')[0]}, your order is confirmed. A writer will be assigned shortly.</p>
    <div style="background:rgba(0,255,135,0.05);border:1px solid rgba(0,255,135,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Reference', '#'+order.id.substring(0,8).toUpperCase())}
        ${row('Paper', order.title.substring(0,60))}
        ${row('Pages', `${order.pages} (${order.pages * 275} words)`)}
        ${row('Deadline', deadline)}
        ${row('Amount Paid', `$${order.price.toFixed(2)} USD`)}
      </table>
    </div>
    <div style="background:rgba(0,229,255,0.05);border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="color:#00E5FF;font-weight:700;font-size:13px;margin:0 0 8px;">What happens next?</p>
      <ol style="color:#8892a4;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
        <li>Writer assigned within <strong style="color:#eef2f7;">2 hours</strong></li>
        <li>Progress updates via email</li>
        <li>Download from your dashboard when complete</li>
        <li>Free revisions for <strong style="color:#eef2f7;">30 days</strong></li>
      </ol>
    </div>
    <a href="${SITE_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#00E5FF,#00b8cc);color:#080f1e;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;margin-bottom:12px;">Track My Order →</a>
    <p style="color:#8892a4;font-size:12px;text-align:center;margin:0;">Questions? <a href="mailto:${ADMIN_EMAIL}" style="color:#00E5FF;">${ADMIN_EMAIL}</a></p>`

  return getResend().emails.send({
    from: FROM_EMAIL, to: clientEmail,
    subject: `✅ Order Confirmed — ${order.paper_type}: ${order.title.substring(0,50)}`,
    html: baseTemplate(content, 'Order Confirmed — StudyFlowHQ'),
  })
}

export async function sendStatusUpdate(order: {
  id: string; title: string; paper_type: string; status: string
}, clientEmail: string, clientName: string) {
  const statusMap: Record<string, { emoji: string; headline: string; color: string; body: string }> = {
    assigned:    { emoji: '✍️', headline: 'Writer Assigned', color: '#00E5FF', body: 'A professional writer has been assigned and has started working on your paper.' },
    in_progress: { emoji: '⚡', headline: 'Work In Progress', color: '#00ff87', body: 'Your writer is actively working. You\'ll be notified when it\'s ready for review.' },
    review:      { emoji: '👀', headline: 'Quality Review', color: '#ffd60a', body: 'Your paper is undergoing quality review before final delivery.' },
    completed:   { emoji: '🎉', headline: 'Paper Ready!', color: '#00ff87', body: 'Your completed paper is ready to download from your dashboard. Free revisions available for 30 days.' },
  }
  const s = statusMap[order.status] || { emoji: '📋', headline: 'Status Update', color: '#00E5FF', body: `Order status: ${order.status}` }

  const content = `
    <h2 style="color:${s.color};font-size:22px;font-weight:800;margin:0 0 8px;">${s.emoji} ${s.headline}</h2>
    <p style="color:#8892a4;font-size:14px;margin:0 0 24px;">Hi ${clientName.split(' ')[0]}, here's an update on your order.</p>
    <div style="background:rgba(0,229,255,0.04);border:1px solid rgba(0,229,255,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="color:#eef2f7;font-size:14px;font-weight:700;margin:0 0 4px;">${order.title}</p>
      <p style="color:#8892a4;font-size:12px;margin:0;">Order #${order.id.substring(0,8).toUpperCase()} · ${order.paper_type}</p>
    </div>
    <div style="background:rgba(0,229,255,0.03);border-radius:10px;padding:14px;margin-bottom:24px;">
      <p style="color:${s.color};font-size:14px;margin:0;">${s.body}</p>
    </div>
    <a href="${SITE_URL}/dashboard" style="display:block;background:linear-gradient(135deg,#00E5FF,#00b8cc);color:#080f1e;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;">View Dashboard →</a>`

  return getResend().emails.send({
    from: FROM_EMAIL, to: clientEmail,
    subject: `${s.emoji} ${s.headline} — ${order.title.substring(0,50)}`,
    html: baseTemplate(content, `${s.headline} — StudyFlowHQ`),
  })
}

export async function sendPaymentReceived(order: {
  id: string; title: string; price: number; paper_type: string
}, clientEmail: string, clientName: string) {
  const content = `
    <h2 style="color:#00ff87;font-size:22px;font-weight:800;margin:0 0 8px;">💰 Payment Confirmed</h2>
    <p style="color:#8892a4;font-size:14px;margin:0 0 24px;">Payment has been confirmed. Assign a writer immediately.</p>
    <div style="background:rgba(0,255,135,0.06);border:1px solid rgba(0,255,135,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Order ID', '#'+order.id.substring(0,8).toUpperCase())}
        ${row('Client', clientName)}
        ${row('Email', clientEmail)}
        ${row('Paper', order.title.substring(0,60))}
        ${row('Amount', `$${order.price.toFixed(2)} USD`)}
      </table>
    </div>
    <a href="${SITE_URL}/admin" style="display:block;background:linear-gradient(135deg,#00ff87,#00cc6a);color:#080f1e;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;">Assign Writer Now →</a>`

  return getResend().emails.send({
    from: FROM_EMAIL, to: ADMIN_EMAIL,
    subject: `💰 $${order.price.toFixed(2)} Paid — Order #${order.id.substring(0,8).toUpperCase()}`,
    html: baseTemplate(content, 'Payment Received — StudyFlowHQ'),
  })
}
