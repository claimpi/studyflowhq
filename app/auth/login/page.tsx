'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0B1320 0%, #0d1f3c 100%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.6rem', fontWeight: 800, textDecoration: 'none' }}>
            <span className="gradient-text">StudyFlow</span><span style={{ color: '#AAB4C0' }}>HQ</span>
          </Link>
          <div style={{ color: '#AAB4C0', marginTop: '0.5rem' }}>Sign in to your account</div>
        </div>
        <div className="card-glass" style={{ borderRadius: '1rem', padding: '2rem' }}>
          {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.25rem', color: '#ff8080', fontSize: '0.85rem' }}>{error}</div>}
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input required type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input required type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#AAB4C0', fontSize: '0.85rem' }}>
            Don&apos;t have an account? <Link href="/auth/register" style={{ color: '#00E5FF', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
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
