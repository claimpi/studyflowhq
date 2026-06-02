'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
        skipBrowserRedirect: true,
      },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data?.url) window.location.href = data.url
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080f1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#080f1e' }}>S</div>
        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#eef2f7', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
          StudyFlow<span style={{ color: '#00E5FF' }}>HQ</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#0e1a2e',
        border: '1px solid rgba(0,229,255,0.15)',
        borderRadius: 20,
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#eef2f7', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Welcome back
          </h1>
          <p style={{ color: '#8892a4', fontSize: '0.9rem' }}>Sign in to manage your orders</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 10, padding: '0.8rem 1rem', marginBottom: '1.5rem', color: '#ff4d6d', fontSize: '0.85rem' }}>
            ⚠ {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.5rem',
            background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            color: '#eef2f7',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: 'Outfit, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.06)' }}
        >
          {loading ? (
            <>
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Redirecting to Google...
            </>
          ) : (
            <>
              {/* Google Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,229,255,0.08)' }} />
          <span style={{ color: '#8892a4', fontSize: '0.78rem' }}>Instant · Secure · Free</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,229,255,0.08)' }} />
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {[
            { icon: '⚡', text: 'One click sign in — no password needed' },
            { icon: '🔒', text: 'Secured by Google authentication' },
            { icon: '📋', text: 'Access your orders instantly' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(0,229,255,0.03)', borderRadius: 8 }}>
              <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
              <span style={{ color: '#8892a4', fontSize: '0.82rem' }}>{b.text}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#8892a4', fontSize: '0.78rem', lineHeight: 1.6 }}>
          By signing in, you agree to our{' '}
          <Link href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" style={{ color: '#00E5FF', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>

      {/* New user note */}
      <p style={{ marginTop: '1.5rem', color: '#8892a4', fontSize: '0.85rem', textAlign: 'center' }}>
        New here? Just sign in with Google — your account is created automatically.
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
