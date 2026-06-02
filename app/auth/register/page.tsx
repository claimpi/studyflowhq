'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.full_name }, emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (err) { setError(err.message); setLoading(false); return }
    setSuccess(true)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Check your email!</h2>
        <p style={{ color: '#AAB4C0' }}>We sent a confirmation link to <strong style={{ color: '#00E5FF' }}>{form.email}</strong></p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0B1320 0%, #0d1f3c 100%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.6rem', fontWeight: 800, textDecoration: 'none' }}>
            <span className="gradient-text">StudyFlow</span><span style={{ color: '#AAB4C0' }}>HQ</span>
          </Link>
          <div style={{ color: '#AAB4C0', marginTop: '0.5rem' }}>Create your account</div>
        </div>
        <div className="card-glass" style={{ borderRadius: '1rem', padding: '2rem' }}>
          {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.25rem', color: '#ff8080', fontSize: '0.85rem' }}>{error}</div>}
          <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1.25rem' }}>
            {[{ k:'full_name', l:'Full Name', t:'text', p:'John Doe' }, { k:'email', l:'Email', t:'email', p:'you@example.com' }, { k:'password', l:'Password', t:'password', p:'Min 8 characters' }].map(f => (
              <div key={f.k}>
                <label style={labelStyle}>{f.l}</label>
                <input required type={f.t} style={inputStyle} value={form[f.k as keyof typeof form]} onChange={e => setForm({...form, [f.k]: e.target.value})} placeholder={f.p} minLength={f.k==='password'?8:undefined} />
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#AAB4C0', fontSize: '0.85rem' }}>
            Already have an account? <Link href="/auth/login" style={{ color: '#00E5FF', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(11,19,32,0.8)', border: '1px solid rgba(0,229,255,0.2)',
  borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#F0F4F8', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = {
  display: 'block', color: '#AAB4C0', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.04em',
}
