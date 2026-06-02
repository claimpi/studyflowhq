import { NextRequest, NextResponse } from 'next/server'
import { getPesaPalToken, getTransactionStatus } from '@/lib/pesapal'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendPaymentReceived, sendNewOrderAdmin, sendOrderConfirmation } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderTrackingId = searchParams.get('OrderTrackingId')
    const orderMerchantReference = searchParams.get('OrderMerchantReference')

    if (!orderTrackingId || !orderMerchantReference) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const token = await getPesaPalToken()
    const status = await getTransactionStatus(token, orderTrackingId)
    const paymentStatus = status.payment_status_description?.toLowerCase() === 'completed' ? 'paid' : 'pending'

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} } } }
    )

    await supabase.from('orders').update({
      payment_status: paymentStatus,
      status: paymentStatus === 'paid' ? 'assigned' : 'pending',
      payment_tracking_id: orderTrackingId,
    }).eq('id', orderMerchantReference)

    // Fetch full order to send emails
    if (paymentStatus === 'paid') {
      const { data: order } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .eq('id', orderMerchantReference)
        .single()

      if (order) {
        const profile = order.profiles as { full_name: string; email: string } | null
        try {
          // Email admin
          await sendPaymentReceived(order, profile?.email || '', profile?.full_name || 'Student')
          // Email admin new order details
          await sendNewOrderAdmin({ ...order, user_email: profile?.email, user_name: profile?.full_name })
          // Email client confirmation
          if (profile?.email) {
            await sendOrderConfirmation(order, profile.email, profile.full_name)
          }
        } catch (e) {
          console.error('Email error after payment:', e)
        }
      }
    }

    return NextResponse.json({ status: paymentStatus, orderTrackingId })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
