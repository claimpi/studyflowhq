'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function Content() {
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading'|'success'|'pending'|'failed'>('loading')
  const orderId = params.get('order_id')
  const tracking = params.get('OrderTrackingId')

  useEffect(() => {
    if (tracking && orderId) {
      fetch(`/api/payment/callback?OrderTrackingId=${tracking}&OrderMerchantReference=${orderId}`)
        .then(r => r.json())
        .then(d => setStatus(d.status === 'paid' ? 'success' : d.status === 'pending' ? 'pending' : 'failed'))
        .catch(() => setStatus('failed'))
    } else { setStatus('pending') }
  }, [tracking, orderId])

  const s = {
    loading: { icon: '⏳', color: '#00E5FF', title: 'Verifying...', desc: 'Please wait.' },
    success: { icon: '🎉', color: '#00ff87', title: 'Payment Confirmed!', desc: 'Your order is live. Writers are reviewing it now.' },
    pending: { icon: '⏰', color: '#ffd60a', title: 'Processing', desc: 'Payment is being processed. Check dashboard for updates.' },
    failed:  { icon: '❌', color: '#ff4d6d', title: 'Issue Detected', desc: 'Something went wrong. Try again or contact support.' },
  }[status]

  return (
    <div style={{ minHeight: '100vh', background: '#080f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#0e1a2e', border: `1px solid ${s.color}30`, borderRadius: 20, padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>{s.icon}</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, marginBottom: '0.75rem' }}>{s.title}</h2>
        <p style={{ color: '#8892a4', marginBottom: '2rem', lineHeight: 1.6 }}>{s.desc}</p>
        {orderId && <div style={{ background: 'rgba(0,229,255,0.05)', borderRadius: 10, padding: '0.75rem', fontSize: '0.82rem', color: '#8892a4', marginBottom: '2rem' }}>Order: <span style={{ color: '#00E5FF', fontFamily: 'monospace' }}>{orderId.substring(0,8)}...</span></div>}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link href="/dashboard" style={{ display: 'block', background: 'linear-gradient(135deg,#00E5FF,#00b8cc)', color: '#080f1e', fontWeight: 700, padding: '0.9rem', borderRadius: 10, textDecoration: 'none' }}>Go to Dashboard →</Link>
          {status === 'failed' && <Link href="/order" style={{ display: 'block', border: '1.5px solid rgba(0,229,255,0.25)', color: '#00E5FF', fontWeight: 600, padding: '0.9rem', borderRadius: 10, textDecoration: 'none' }}>Try Again</Link>}
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallback() {
  return <Suspense fallback={<div style={{minHeight:'100vh',background:'#080f1e',display:'flex',alignItems:'center',justifyContent:'center',color:'#00E5FF'}}>Loading...</div>}><Content /></Suspense>
}
