import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const writers = [
  { name: 'Dr. Sarah M.', subjects: ['Literature','History','Cultural Studies'], orders: 1240, rating: 4.9, degree: 'PhD in Literature', bio: 'Published author with 10+ years of academic writing experience.', available: true },
  { name: 'James K.', subjects: ['Business','Economics','Finance'], orders: 876, rating: 4.8, degree: 'MBA Finance', bio: 'Former financial analyst turned academic writing specialist.', available: true },
  { name: 'Priya R.', subjects: ['Biology','Chemistry','Medicine'], orders: 654, rating: 5.0, degree: 'MSc Biochemistry', bio: 'Biomedical researcher with expertise in lab reports and reviews.', available: true },
  { name: 'Alex T.', subjects: ['Computer Science','Mathematics','Physics'], orders: 932, rating: 4.9, degree: 'MSc Computer Science', bio: 'Software engineer specialising in STEM academic assignments.', available: false },
  { name: 'Dr. Maria L.', subjects: ['Psychology','Sociology','Education'], orders: 1100, rating: 4.8, degree: 'PhD Psychology', bio: 'Clinical psychologist with extensive research publication record.', available: true },
  { name: 'Omar A.', subjects: ['Law','Political Science','Ethics'], orders: 723, rating: 4.7, degree: 'LLM International Law', bio: 'Legal researcher specialising in comparative and international law.', available: true },
  { name: 'Chen W.', subjects: ['Engineering','Physics','Maths'], orders: 540, rating: 4.9, degree: 'MEng Electrical Engineering', bio: 'Practising engineer with deep expertise in STEM problem sets.', available: true },
  { name: 'Amara N.', subjects: ['Nursing','Public Health','Biology'], orders: 415, rating: 5.0, degree: 'MSc Nursing', bio: 'Registered nurse and clinical educator writing healthcare papers.', available: false },
]

export default function WritersPage() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Our <span className="gradient-text">Expert Writers</span></h1>
          <p style={{ color: '#AAB4C0', maxWidth: 500, margin: '0 auto' }}>Verified academics and professionals ready to help with your papers.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {writers.map(w => (
            <div key={w.name} className="card-glass" style={{ borderRadius: '1rem', padding: '1.75rem', position: 'relative' }}>
              {w.available ? (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(57,255,136,0.15)', color: '#39FF88', border: '1px solid rgba(57,255,136,0.3)', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>AVAILABLE</div>
              ) : (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(170,180,192,0.1)', color: '#AAB4C0', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>BUSY</div>
              )}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #39FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: '#0B1320', marginBottom: '1rem' }}>
                {w.name.charAt(0)}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{w.name}</div>
              <div style={{ color: '#39FF88', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>{w.degree}</div>
              <p style={{ color: '#AAB4C0', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>{w.bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {w.subjects.map(s => (
                  <span key={s} style={{ background: 'rgba(0,229,255,0.08)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(170,180,192,0.1)', paddingTop: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}><div style={{ color: '#00E5FF', fontWeight: 700 }}>{w.rating}★</div><div style={{ color: '#AAB4C0', fontSize: '0.7rem' }}>Rating</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ color: '#00E5FF', fontWeight: 700 }}>{w.orders}</div><div style={{ color: '#AAB4C0', fontSize: '0.7rem' }}>Orders</div></div>
                <Link href="/order" style={{ alignSelf: 'center' }} className="btn-primary">
                  <span style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}>Hire</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
