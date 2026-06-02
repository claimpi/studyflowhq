'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const stats = [
  { value: '97%', label: 'On-time delivery' },
  { value: '4.9★', label: 'Average rating' },
  { value: '15K+', label: 'Orders completed' },
  { value: '500+', label: 'Expert writers' },
]

const services = [
  { icon: '📝', title: 'Essay Writing', desc: 'Any topic, any level. From high school to PhD.' },
  { icon: '🔬', title: 'Research Papers', desc: 'In-depth research with credible sources.' },
  { icon: '📚', title: 'Dissertations', desc: 'Full dissertation support from proposal to defence.' },
  { icon: '✏️', title: 'Editing & Proofreading', desc: 'Polished, error-free academic writing.' },
  { icon: '📊', title: 'Case Studies', desc: 'Analytical case studies with real-world insight.' },
  { icon: '💻', title: 'Coding & STEM', desc: 'Programming assignments and STEM problem sets.' },
]

const steps = [
  { n: '01', title: 'Submit Your Order', desc: 'Fill in your requirements — topic, pages, deadline, academic level.' },
  { n: '02', title: 'Pick Your Writer', desc: 'Browse writer profiles, ratings, and bids. Choose your match.' },
  { n: '03', title: 'Collaborate', desc: 'Chat with your writer, track progress, request adjustments.' },
  { n: '04', title: 'Download & Succeed', desc: 'Receive your completed paper and request free revisions if needed.' },
]

const writers = [
  { name: 'Dr. Sarah M.', subjects: 'Literature, History', orders: 1240, rating: '4.9', degree: 'PhD' },
  { name: 'James K.', subjects: 'Business, Economics', orders: 876, rating: '4.8', degree: 'MBA' },
  { name: 'Priya R.', subjects: 'Biology, Chemistry', orders: 654, rating: '5.0', degree: 'MSc' },
  { name: 'Alex T.', subjects: 'CS, Mathematics', orders: 932, rating: '4.9', degree: 'MSc' },
]

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0B1320 0%, #0d1f3c 100%)', padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: 300, height: 300, background: 'radial-gradient(circle, rgba(57,255,136,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 100, padding: '0.35rem 1rem', fontSize: '0.8rem', color: '#00E5FF', marginBottom: '1.5rem', fontWeight: 600 }}>
            🎓 Trusted by 15,000+ students worldwide
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Academic Writing That<br /><span className="gradient-text">Flows. Delivers. Succeeds.</span>
          </h1>
          <p style={{ color: '#AAB4C0', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Connect with expert writers across every subject. Get original, well-researched papers delivered on time — every time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/order" className="btn-primary" style={{ fontSize: '1rem' }}>Start My Order →</Link>
            <Link href="/writers" className="btn-outline" style={{ fontSize: '1rem' }}>Browse Writers</Link>
          </div>

          {/* Price calculator teaser */}
          <div className="card-glass" style={{ maxWidth: 560, margin: '3rem auto 0', borderRadius: '1rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: '#AAB4C0', fontSize: '0.9rem' }}>Starting from</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00E5FF' }}>$10.80</span>
            <span style={{ color: '#AAB4C0', fontSize: '0.9rem' }}>per page · 275 words</span>
            <Link href="/order" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Get Quote</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0d1a2d', padding: '3rem 1.5rem', borderTop: '1px solid rgba(0,229,255,0.1)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00E5FF' }}>{s.value}</div>
              <div style={{ color: '#AAB4C0', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Every Type of Academic Work</h2>
            <p style={{ color: '#AAB4C0', maxWidth: 500, margin: '0 auto' }}>From quick essays to full dissertations — our writers cover it all.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {services.map(s => (
              <div key={s.title} className="card-glass" style={{ borderRadius: '1rem', padding: '1.75rem', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ color: '#AAB4C0', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: '#0d1a2d', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>How StudyFlowHQ Works</h2>
            <p style={{ color: '#AAB4C0' }}>Simple, transparent, and built for students.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {steps.map(s => (
              <div key={s.n} style={{ position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(0,229,255,0.15)', marginBottom: '0.5rem' }}>{s.n}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#00E5FF' }}>{s.title}</div>
                <div style={{ color: '#AAB4C0', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP WRITERS */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Meet Our Top Writers</h2>
            <p style={{ color: '#AAB4C0' }}>Verified experts with proven track records.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {writers.map(w => (
              <div key={w.name} className="card-glass" style={{ borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #39FF88)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#0B1320' }}>
                  {w.name.charAt(0)}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{w.name}</div>
                <div style={{ color: '#39FF88', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>{w.degree}</div>
                <div style={{ color: '#AAB4C0', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{w.subjects}</div>
                <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(170,180,192,0.1)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <div><div style={{ color: '#00E5FF', fontWeight: 700 }}>{w.rating}★</div><div style={{ color: '#AAB4C0', fontSize: '0.7rem' }}>Rating</div></div>
                  <div><div style={{ color: '#00E5FF', fontWeight: 700 }}>{w.orders}</div><div style={{ color: '#AAB4C0', fontSize: '0.7rem' }}>Orders</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/writers" className="btn-outline">View All Writers →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #00E5FF15, #39FF8810)', borderTop: '1px solid rgba(0,229,255,0.2)', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Get Started?</h2>
        <p style={{ color: '#AAB4C0', marginBottom: '2rem', fontSize: '1.05rem' }}>Join thousands of students getting better grades with StudyFlowHQ.</p>
        <Link href="/order" className="btn-primary" style={{ fontSize: '1.05rem' }}>Place Your Order Now →</Link>
      </section>

      <Footer />
    </>
  )
}
