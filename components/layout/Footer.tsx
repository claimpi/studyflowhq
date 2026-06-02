import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#060d18', borderTop: '1px solid rgba(0,229,255,0.1)', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <span className="gradient-text">StudyFlow</span><span style={{ color: '#AAB4C0' }}>HQ</span>
          </div>
          <p style={{ color: '#AAB4C0', fontSize: '0.85rem', lineHeight: 1.7 }}>Expert academic writing, on-time delivery, 100% original work.</p>
        </div>
        <div>
          <div style={{ color: '#00E5FF', fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services</div>
          {['Essay Writing','Research Papers','Dissertations','Coursework','Editing'].map(s => (
            <div key={s} style={{ marginBottom: '0.5rem' }}><Link href="/order" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.85rem' }}>{s}</Link></div>
          ))}
        </div>
        <div>
          <div style={{ color: '#00E5FF', fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
          {['About Us','Writers','Reviews','Blog','Contact'].map(s => (
            <div key={s} style={{ marginBottom: '0.5rem' }}><Link href="#" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.85rem' }}>{s}</Link></div>
          ))}
        </div>
        <div>
          <div style={{ color: '#00E5FF', fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</div>
          {['Privacy Policy','Terms of Service','Refund Policy','Cookie Policy'].map(s => (
            <div key={s} style={{ marginBottom: '0.5rem' }}><Link href="#" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.85rem' }}>{s}</Link></div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(170,180,192,0.1)', textAlign: 'center', color: '#AAB4C0', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} StudyFlowHQ. All rights reserved.
      </div>
    </footer>
  )
}
