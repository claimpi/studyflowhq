'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  const avatar = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)

  return (
    <nav style={{
      background: scrolled ? 'rgba(8,15,30,0.97)' : 'rgba(8,15,30,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(0,229,255,0.12)' : '1px solid transparent',
      position: 'sticky', top: 0, zIndex: 100,
      transition: 'all 0.3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: '#080f1e' }}>S</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#eef2f7', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
            StudyFlow<span style={{ color: '#00E5FF' }}>HQ</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { href: '/writers', label: 'Our Writers' },
            { href: '/#how-it-works', label: 'How It Works' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/reviews', label: 'Reviews' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: pathname === l.href ? '#00E5FF' : '#8892a4', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s', fontFamily: 'Outfit, sans-serif' }}>{l.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 100, padding: '0.35rem 0.9rem 0.35rem 0.35rem', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {avatar ? (
                  <img src={avatar} alt={name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#080f1e' }}>{initials}</div>
                )}
                <span style={{ color: '#eef2f7', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{name.split(' ')[0]}</span>
                <span style={{ color: '#8892a4', fontSize: '0.7rem' }}>{menuOpen ? '▲' : '▼'}</span>
              </button>

              {menuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 12, minWidth: 180, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 200 }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#eef2f7', fontFamily: 'Outfit, sans-serif' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{user.email}</div>
                  </div>
                  {[
                    { href: '/dashboard', icon: '📋', label: 'My Orders' },
                    { href: '/order', icon: '✦', label: 'New Order' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', color: '#c4cdd8', textDecoration: 'none', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                    <button onClick={handleSignOut}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', color: '#ff4d6d', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                Sign In
              </Link>
              <Link href="/order" className="btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem', borderRadius: 8, fontFamily: 'Outfit, sans-serif' }}>
                Start Order ✦
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}
