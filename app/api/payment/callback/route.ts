import { NextRequest, NextResponse } from 'next/server'
import { getPesaPalToken, getTransactionStatus } from '@/lib/pesapal'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
    }).eq('id', orderMerchantReference)

    return NextResponse.json({ status: paymentStatus, orderTrackingId })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
