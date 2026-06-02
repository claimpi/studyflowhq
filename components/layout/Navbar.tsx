'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '/writers', label: 'Our Writers' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
  ]

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
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#eef2f7', letterSpacing: '-0.02em' }}>
            StudyFlow<span style={{ color: '#00E5FF' }}>HQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: pathname === l.href ? '#00E5FF' : '#8892a4',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
              transition: 'color 0.2s'
            }}>{l.label}</Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/auth/login" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem' }}>
            Sign In
          </Link>
          <Link href="/order" className="btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem', borderRadius: 8 }}>
            Start Order ✦
          </Link>
        </div>
      </div>
    </nav>
  )
}
