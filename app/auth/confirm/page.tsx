'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function ConfirmInner() {
  const router = useRouter()
  const [status, setStatus] = useState('Completing sign in...')

  useEffect(() => {
    async function handleAuth() {
      const supabase = createClient()

      // Handle hash fragment from implicit flow
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        try {
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            if (error) throw error
          }
        } catch {
          setStatus('Authentication failed. Redirecting...')
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }
      }

      // Wait briefly then check session
      await new Promise(r => setTimeout(r, 800))
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setStatus('Success! Redirecting to dashboard...')
        // Ensure profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          const nameParts = (session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User').split(' ')
          await supabase.from('profiles').upsert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
            role: 'student',
          })
        }
        router.push('/dashboard')
      } else {
        setStatus('Session not found. Redirecting...')
        setTimeout(() => router.push('/auth/login'), 2000)
      }
    }

    handleAuth()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080f1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Animated logo */}
      <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', color: '#080f1e', boxShadow: '0 0 30px rgba(0,229,255,0.4)' }}>S</div>

      {/* Spinner */}
      <div style={{ width: 40, height: 40, border: '3px solid rgba(0,229,255,0.15)', borderTopColor: '#00E5FF', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />

      <p style={{ color: '#8892a4', fontSize: '0.95rem', fontWeight: 500 }}>{status}</p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5FF', fontFamily: 'Outfit, sans-serif' }}>
        Loading...
      </div>
    }>
      <ConfirmInner />
    </Suspense>
  )
}
