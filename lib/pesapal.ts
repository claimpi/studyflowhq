// PesaPal v3 API Integration
const PESAPAL_BASE = 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || '7dyB5aZ5/1RWwRsQTGw3cwLV6idXS7Rj'
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'GvugOqhxgP5D/hNEfurRVPMu1MY='

interface PesaPalToken {
  token: string
  expiryDate: string
  status: string
}

interface OrderRequest {
  orderId: string
  amount: number
  currency: string
  description: string
  callbackUrl: string
  billingEmail: string
  billingFirstName: string
  billingLastName: string
  billingPhone?: string
}

// Get auth token
export async function getPesaPalToken(): Promise<string> {
  const res = await fetch(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET }),
  })
  if (!res.ok) throw new Error(`PesaPal auth failed: ${res.status}`)
  const data: PesaPalToken = await res.json()
  if (data.status !== '200') throw new Error('PesaPal auth error')
  return data.token
}

// Register IPN (Instant Payment Notification) URL
export async function registerIPN(token: string, notificationUrl: string) {
  const res = await fetch(`${PESAPAL_BASE}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: notificationUrl,
      ipn_notification_type: 'GET',
    }),
  })
  if (!res.ok) throw new Error('IPN registration failed')
  return await res.json()
}

// Submit order to PesaPal
export async function submitOrder(token: string, order: OrderRequest, ipnId: string) {
  const res = await fetch(`${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: order.orderId,
      currency: order.currency,
      amount: order.amount,
      description: order.description,
      callback_url: order.callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: order.billingEmail,
        first_name: order.billingFirstName,
        last_name: order.billingLastName,
        phone_number: order.billingPhone || '',
        country_code: 'KE',
        state: 'Nairobi',
        postal_code: '00100',
        line_1: 'Nairobi',
        line_2: '',
        city: 'Nairobi',
      },
    }),
  })
  if (!res.ok) throw new Error('Order submission failed')
  return await res.json()
}

// Get transaction status
export async function getTransactionStatus(token: string, orderTrackingId: string) {
  const res = await fetch(
    `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  )
  if (!res.ok) throw new Error('Status check failed')
  return await res.json()
}
