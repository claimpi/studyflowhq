import { NextRequest, NextResponse } from 'next/server'
import { sendNewOrderAdmin, sendOrderConfirmation, sendStatusUpdate, sendPaymentReceived } from '@/lib/email'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, orderId, clientEmail: directEmail, clientName: directName } = body

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} } } }
    )

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .eq('id', orderId)
      .single()

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Resolve client contact — prefer profile, fall back to billing fields, then direct params
    const profile = order.profiles as { full_name: string; email: string } | null
    const clientEmail = profile?.email || order.billing_email || directEmail || ''
    const clientName = profile?.full_name || order.billing_name || directName || 'Student'

    switch (type) {
      case 'new_order':
        // Email admin with full order details
        await sendNewOrderAdmin({
          ...order,
          user_email: clientEmail,
          user_name: clientName,
        })
        // Email client confirmation
        if (clientEmail) {
          await sendOrderConfirmation(order, clientEmail, clientName)
        }
        break

      case 'status_update':
        if (clientEmail) {
          await sendStatusUpdate(order, clientEmail, clientName)
        }
        break

      case 'payment_received':
        await sendPaymentReceived(order, clientEmail, clientName)
        if (clientEmail) {
          await sendOrderConfirmation(order, clientEmail, clientName)
        }
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    // Don't crash — email failure shouldn't break the user flow
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
