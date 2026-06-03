'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const stats = [
  { value: '97%', label: 'On-time delivery' },
  { value: '4.9★', label: 'Average rating' },
  { value: '15K+', label: 'Orders completed' },
  { value: '500+', label: 'Expert writers' },
]

const services = [
  { icon: '📝', title: 'Essay Writing', desc: 'Any topic, any level. From high school to PhD.' },
  { icon: '🔬', title: 'Research Papers', desc: 'In-depth research with credible sources and proper citations.' },
  { icon: '📚', title: 'Dissertations', desc: 'Full dissertation support from proposal to final defence.' },
  { icon: '✏️', title: 'Editing & Proofreading', desc: 'Polished, error-free writing every time.' },
  { icon: '📊', title: 'Case Studies', desc: 'Analytical case studies with real-world insight.' },
  { icon: '💻', title: 'Coding & STEM', desc: 'Programming assignments and STEM problem sets.' },
]

const steps = [
  { n: '01', title: 'Submit Your Brief', desc: 'Upload your document or fill in requirements. We auto-detect page count.' },
  { n: '02', title: 'Get Instant Quote', desc: 'See your price immediately based on level, pages and deadline.' },
  { n: '03', title: 'Pay Securely', desc: 'M-Pesa, Visa, Mastercard or Airtel Money — all secured by PesaPal.' },
  { n: '04', title: 'Download & Succeed', desc: 'Receive your paper via dashboard. Free revisions for 30 days.' },
]

const writers = [
  { name: 'Dr. Sarah M.', subjects: 'Literature · History', orders: 1240, rating: '4.9', degree: 'PhD' },
  { name: 'James K.', subjects: 'Business · Economics', orders: 876, rating: '4.8', degree: 'MBA' },
  { name: 'Priya R.', subjects: 'Biology · Chemistry', orders: 654, rating: '5.0', degree: 'MSc' },
  { name: 'Alex T.', subjects: 'CS · Mathematics', orders: 932, rating: '4.9', degree: 'MSc' },
]

const reviews = [
  { name: 'James K.', country: '🇰🇪', text: 'Delivered my MBA dissertation 2 days early. Supervisor was very impressed.', rating: 5, subject: 'Business' },
  { name: 'Amara N.', country: '🇬🇧', text: 'Real nursing knowledge in my clinical case study. Will use again.', rating: 5, subject: 'Nursing' },
  { name: 'David M.', country: '🇿🇦', text: 'Python project done in 48hrs. Clean code, full report. Got a distinction.', rating: 5, subject: 'CS' },
  { name: 'Priya R.', country: '🇮🇳', text: 'Contract law essay with perfect legal citations. Submitted with confidence.', rating: 5, subject: 'Law' },
]

const portalFeatures = [
  { icon: '📋', title: 'Order Dashboard', desc: 'Track every order in real time — status, writer assigned, deadline countdown.' },
  { icon: '📄', title: 'Document Upload', desc: 'Upload your assignment brief as PDF or Word. We auto-detect page count instantly.' },
  { icon: '📧', title: 'Email Notifications', desc: 'Auto-emails at every stage — confirmation, writer assigned, paper ready.' },
  { icon: '🔄', title: 'Revision Requests', desc: 'Request free revisions directly from your dashboard within 30 days.' },
  { icon: '📥', title: 'Paper Downloads', desc: 'Download your completed papers securely from your personal portal.' },
  { icon: '🔐', title: 'Secure Login', desc: 'One-click Google Sign In. Your identity and orders are fully confidential.' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = target / 60
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

export default function Home() {
  const [writerOnline] = useState(47)
  const F: React.CSSProperties = { fontFamily: 'Outfit, sans-serif' }

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section style={{ background: '#080f1e', padding: '5rem 1.5rem 0', position: 'relative', overflow: 'hidden', ...F }}>
        {/* Background grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -120, right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 100, left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,255,135,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '2rem', background: 'rgba(0,229,255,0.05)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff87', display: 'inline-block', boxShadow: '0 0 8px #00ff87', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ color: '#00E5FF', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{writerOnline} writers online now</span>
          </div>

          {/* Eyebrow */}
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Academic Writing Service
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '1.25rem', color: '#eef2f7' }}>
            Get Your
          </h1>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '1.75rem', background: 'linear-gradient(90deg, #00E5FF 0%, #00ff87 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Paper Done.
          </h1>

          {/* Subtext */}
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.6, letterSpacing: '0.01em' }}>
            Expert writers · 12hr delivery · From $10.80/page · 100% plagiarism-free
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/order" style={{ background: '#00E5FF', color: '#080f1e', padding: '0.9rem 2rem', borderRadius: 10, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 0 30px rgba(0,229,255,0.25)', fontFamily: 'Outfit, sans-serif' }}>
              Start My Order ✦
            </Link>
            <Link href="/pricing" style={{ border: '1.5px solid rgba(0,229,255,0.3)', color: '#00E5FF', padding: '0.9rem 2rem', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
              Calculate Price →
            </Link>
          </div>

          {/* Trust line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingBottom: '3rem' }}>
            {['🔒 Secure payment', '✅ Plagiarism-free', '🔄 Free revisions', '⏰ On-time guarantee'].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop: '1px solid rgba(0,229,255,0.1)', background: 'rgba(0,229,255,0.03)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '1.5rem' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem', borderRight: '1px solid rgba(0,229,255,0.08)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00E5FF', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ background: '#080f1e', padding: '5rem 1.5rem', ...F }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>What We Cover</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.03em', margin: 0 }}>Every Type of Academic Work</h2>
            </div>
            <Link href="/order" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, border: '1px solid rgba(0,229,255,0.2)', padding: '0.5rem 1.25rem', borderRadius: 8, whiteSpace: 'nowrap' }}>Browse all subjects →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {services.map((s, i) => (
              <div key={s.title} style={{ background: '#0a1525', padding: '1.75rem', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0e1a2e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0a1525')}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: '#eef2f7', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{s.title}</div>
                <div style={{ color: '#8892a4', fontSize: '0.82rem', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PORTAL MANAGEMENT ─── */}
      <section style={{ background: '#060d18', padding: '5rem 1.5rem', borderTop: '1px solid rgba(0,229,255,0.08)', borderBottom: '1px solid rgba(0,229,255,0.08)', ...F }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left: copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 100, padding: '0.3rem 0.9rem', fontSize: '0.75rem', color: '#00ff87', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                🖥 Student Portal
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
                Your Own <span style={{ background: 'linear-gradient(135deg, #00E5FF, #00ff87)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Academic Portal</span>
              </h2>
              <p style={{ color: '#8892a4', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 460 }}>
                Every student gets a personal dashboard to manage their orders from start to finish. Upload briefs, track writer progress, download papers, and request revisions — all in one secure place.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/auth/login" style={{ background: 'linear-gradient(135deg, #00E5FF, #00b8cc)', color: '#080f1e', padding: '0.75rem 1.75rem', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
                  Access Your Portal →
                </Link>
                <Link href="/order" style={{ border: '1.5px solid rgba(0,229,255,0.25)', color: '#00E5FF', padding: '0.75rem 1.75rem', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
                  Place an Order
                </Link>
              </div>
            </div>

            {/* Right: feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {portalFeatures.map(f => (
                <div key={f.title} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1.1rem', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.1)')}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, color: '#eef2f7', fontSize: '0.82rem', marginBottom: '0.3rem' }}>{f.title}</div>
                  <div style={{ color: '#8892a4', fontSize: '0.75rem', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" style={{ background: '#080f1e', padding: '5rem 1.5rem', ...F }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Simple Process</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.03em' }}>From Brief to Download in 4 Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0', position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ padding: '2rem 1.5rem', borderLeft: i > 0 ? '1px solid rgba(0,229,255,0.08)' : 'none', position: 'relative' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'rgba(0,229,255,0.06)', lineHeight: 1, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>{s.n}</div>
                <div style={{ fontWeight: 800, color: '#00E5FF', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{s.title}</div>
                <div style={{ color: '#8892a4', fontSize: '0.82rem', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/order" style={{ background: '#00E5FF', color: '#080f1e', padding: '0.9rem 2.5rem', borderRadius: 10, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', fontFamily: 'Outfit, sans-serif', display: 'inline-block' }}>
              Start Your Order Now ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TOP WRITERS ─── */}
      <section style={{ background: '#060d18', padding: '5rem 1.5rem', borderTop: '1px solid rgba(0,229,255,0.08)', ...F }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Who Writes Your Papers</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.03em', margin: 0 }}>Meet Our Top Writers</h2>
            </div>
            <Link href="/writers" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, border: '1px solid rgba(0,229,255,0.2)', padding: '0.5rem 1.25rem', borderRadius: 8 }}>View all 500+ writers →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {writers.map(w => (
              <div key={w.name} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#080f1e', flexShrink: 0 }}>{w.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#eef2f7', fontSize: '0.9rem' }}>{w.name}</div>
                    <div style={{ color: '#00ff87', fontSize: '0.72rem', fontWeight: 700 }}>{w.degree}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#ffd60a', fontWeight: 800, fontSize: '0.88rem' }}>{w.rating}★</div>
                </div>
                <div style={{ color: '#8892a4', fontSize: '0.78rem' }}>{w.subjects}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,229,255,0.08)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{w.orders.toLocaleString()} orders</div>
                  <Link href="/order" style={{ fontSize: '0.75rem', color: '#00E5FF', fontWeight: 700, textDecoration: 'none' }}>Hire →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section style={{ background: '#080f1e', padding: '5rem 1.5rem', ...F }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Real Students · Real Results</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.03em' }}>What Students Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {reviews.map(r => (
              <div key={r.name} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ color: '#ffd60a', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{'★'.repeat(r.rating)}</div>
                <p style={{ color: '#c4cdd8', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1rem', fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#080f1e' }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#eef2f7' }}>{r.name} {r.country}</div>
                    <div style={{ color: '#8892a4', fontSize: '0.72rem' }}>{r.subject}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/reviews" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, border: '1px solid rgba(0,229,255,0.2)', padding: '0.6rem 1.5rem', borderRadius: 8, display: 'inline-block' }}>
              Read all reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ background: '#060d18', padding: '6rem 1.5rem', borderTop: '1px solid rgba(0,229,255,0.08)', textAlign: 'center', ...F }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Ready to get started?</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#eef2f7', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1rem' }}>
            Your deadline<br />is our priority.
          </h2>
          <p style={{ color: '#8892a4', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Join 15,000+ students who trust StudyFlowHQ for expert academic writing. Upload your brief and get a quote in seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/order" style={{ background: '#00E5FF', color: '#080f1e', padding: '1rem 2.5rem', borderRadius: 10, fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', fontFamily: 'Outfit, sans-serif', boxShadow: '0 0 30px rgba(0,229,255,0.2)' }}>
              Start My Order ✦
            </Link>
            <Link href="/contact" style={{ border: '1.5px solid rgba(0,229,255,0.25)', color: '#00E5FF', padding: '1rem 2.5rem', borderRadius: 10, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
              Talk to Us
            </Link>
          </div>
          <div style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
            No registration fee · Secure payment · Cancel anytime
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </>
  )
}
