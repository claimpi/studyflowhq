'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'

const PRICE_PER_PAGE: Record<string, number> = {
  high_school: 10.80, undergraduate: 13.50, masters: 16.00, phd: 19.80,
}

export default function OrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', paper_type: 'Essay', subject: '', academic_level: 'undergraduate',
    pages: 1, deadline: '', instructions: '',
  })

  const price = (PRICE_PER_PAGE[form.academic_level] * form.pages).toFixed(2)

  const paperTypes = ['Essay','Research Paper','Term Paper','Case Study','Dissertation','Thesis','Coursework','Lab Report','Book Review','Presentation']
  const subjects = ['Literature','History','Business','Economics','Biology','Chemistry','Physics','Mathematics','Computer Science','Psychology','Sociology','Law','Nursing','Engineering']
  const levels = [{ v:'high_school',l:'High School'},{ v:'undergraduate',l:'Undergraduate'},{ v:'masters',l:"Master's"},{ v:'phd',l:'PhD'}]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login?redirect=/order'); return }
    const { error: err } = await supabase.from('orders').insert({
      ...form, user_id: user.id, price: parseFloat(price), status: 'pending',
      deadline: new Date(form.deadline).toISOString(),
    })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '3rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Place Your <span className="gradient-text">Order</span></h1>
        <p style={{ color: '#AAB4C0', marginBottom: '2.5rem' }}>Fill in your requirements and we'll match you with the perfect writer.</p>
        
        {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', color: '#ff8080' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card-glass" style={{ borderRadius: '1rem', padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', color: '#00E5FF' }}>Paper Details</h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <Field label="Paper Title / Topic *">
                  <input required style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. The Impact of Social Media on Mental Health" />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Paper Type">
                    <select style={inputStyle} value={form.paper_type} onChange={e => setForm({...form, paper_type: e.target.value})}>
                      {paperTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Subject">
                    <select style={inputStyle} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">Select subject...</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <Field label="Academic Level">
                    <select style={inputStyle} value={form.academic_level} onChange={e => setForm({...form, academic_level: e.target.value})}>
                      {levels.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
                    </select>
                  </Field>
                  <Field label="Number of Pages">
                    <input type="number" min={1} max={100} style={inputStyle} value={form.pages} onChange={e => setForm({...form, pages: parseInt(e.target.value)||1})} />
                  </Field>
                  <Field label="Deadline">
                    <input required type="datetime-local" style={inputStyle} value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                  </Field>
                </div>
                <Field label="Instructions & Requirements">
                  <textarea style={{...inputStyle, height: 120, resize: 'vertical'}} value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} placeholder="Any specific requirements, formatting style (APA/MLA), sources needed, etc." />
                </Field>
              </div>
            </div>

            {/* Price summary */}
            <div className="card-glass" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: '#AAB4C0', fontSize: '0.85rem' }}>Estimated Price</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00E5FF' }}>${price}</div>
                <div style={{ color: '#AAB4C0', fontSize: '0.8rem' }}>{form.pages} page{form.pages>1?'s':''} × ${PRICE_PER_PAGE[form.academic_level]}/page</div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting...' : 'Submit Order →'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(11,19,32,0.8)', border: '1px solid rgba(0,229,255,0.2)',
  borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#F0F4F8', fontSize: '0.9rem',
  outline: 'none', fontFamily: 'inherit',
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#AAB4C0', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  )
}
