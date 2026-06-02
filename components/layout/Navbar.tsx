'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{ background: 'rgba(11,19,32,0.95)', borderBottom: '1px solid rgba(0,229,255,0.1)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 800, textDecoration: 'none' }}>
          <span className="gradient-text">StudyFlow</span><span style={{ color: '#AAB4C0' }}>HQ</span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/writers" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.9rem' }}>Writers</Link>
          <Link href="/#how-it-works" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.9rem' }}>How it works</Link>
          <Link href="/auth/login" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
          <Link href="/order" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '0.4rem' }}>Order Now</Link>
        </div>
      </div>
    </nav>
  )
}
