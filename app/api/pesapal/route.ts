import { NextRequest, NextResponse } from 'next/server'
import { getPesaPalToken, registerIPN, submitOrder } from '@/lib/pesapal'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, amount, description, email, firstName, lastName, phone } = body

    if (!orderId || !amount || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyflowhq.vercel.app'
    const callbackUrl = `${siteUrl}/payment/callback?order_id=${orderId}`
    const notificationUrl = `${siteUrl}/api/payment/callback`

    // Get PesaPal auth token
    const token = await getPesaPalToken()

    // Register IPN
    let ipnId = process.env.PESAPAL_IPN_ID || ''
    if (!ipnId) {
      const ipnResult = await registerIPN(token, notificationUrl)
      ipnId = ipnResult.ipn_id || ipnResult.notification_id || 'default'
    }

    // Submit order
    const result = await submitOrder(token, {
      orderId,
      amount: parseFloat(amount),
      currency: 'USD',
      description,
      callbackUrl,
      billingEmail: email,
      billingFirstName: firstName || 'Student',
      billingLastName: lastName || 'User',
      billingPhone: phone,
    }, ipnId)

    // Update order in Supabase with payment tracking ID
    if (result.order_tracking_id) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} } } }
      )
      await supabase.from('orders').update({
        payment_tracking_id: result.order_tracking_id,
        payment_status: 'pending',
      }).eq('id', orderId)
    }

    return NextResponse.json({
      redirectUrl: result.redirect_url,
      orderTrackingId: result.order_tracking_id,
      merchantReference: result.merchant_reference,
    })
  } catch (error) {
    console.error('PesaPal error:', error)
    return NextResponse.json({ error: 'Payment initialization failed', details: String(error) }, { status: 500 })
  }
}
