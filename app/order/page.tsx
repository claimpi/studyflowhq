'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase'

const PRICES: Record<string, number> = {
  high_school: 10.80,
  undergraduate: 13.50,
  masters: 16.00,
  phd: 20.00,
}

const URGENCY: Record<string, { label: string; mult: number }> = {
  '14d': { label: '14 Days', mult: 1.0 },
  '7d':  { label: '7 Days',  mult: 1.15 },
  '3d':  { label: '3 Days',  mult: 1.3 },
  '48h': { label: '48 Hours', mult: 1.5 },
  '24h': { label: '24 Hours', mult: 1.75 },
  '12h': { label: '12 Hours', mult: 2.0 },
}

const PAPER_TYPES = ['Essay','Research Paper','Term Paper','Case Study','Dissertation','Thesis','Coursework','Lab Report','Book Review','Literature Review','Annotated Bibliography','Presentation']
const SUBJECTS = ['Literature','History','Business','Economics','Biology','Chemistry','Physics','Mathematics','Computer Science','Psychology','Sociology','Law','Nursing','Engineering','Political Science','Philosophy']
const LEVELS = [{ v:'high_school',l:'High School'},{ v:'undergraduate',l:'Undergraduate'},{ v:'masters',l:"Master's"},{ v:'phd',l:'PhD/Doctorate'}]

type Step = 1 | 2 | 3

export default function OrderPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [savedOrderId, setSavedOrderId] = useState('')
  const [paymentUrl, setPaymentUrl] = useState('')

  // File state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [detectedPages, setDetectedPages] = useState<number | null>(null)
  const [detecting, setDetecting] = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: '',
    paper_type: 'Essay',
    subject: 'Literature',
    academic_level: 'undergraduate',
    pages: 1,
    urgency: '7d',
    instructions: '',
    spacing: 'double',
    citation: 'APA',
    sources: 3,
  })

  // User state for payment
  const [userInfo, setUserInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  const basePrice = PRICES[form.academic_level] * form.pages * URGENCY[form.urgency].mult
  const serviceFee = basePrice * 0.05
  const totalPrice = basePrice + serviceFee

  // Detect pages from file
  async function detectPages(file: File) {
    setDetecting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/detect-pages', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.pages) {
        setDetectedPages(data.pages)
        setForm(f => ({ ...f, pages: data.pages }))
      }
    } catch {
      // silently fail — user can set manually
    } finally {
      setDetecting(false)
    }
  }

  const handleFile = useCallback((file: File) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const ext = file.name.split('.').pop()?.toLowerCase()
    const validExt = ['pdf','doc','docx','txt','odt'].includes(ext || '')
    if (!allowed.includes(file.type) && !validExt) {
      setError('Please upload a PDF, Word document, or text file.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be under 50MB.')
      return
    }
    setError('')
    setUploadedFile(file)
    detectPages(file)
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleNext() {
    if (step === 1) {
      if (!form.title.trim()) { setError('Please enter the assignment title.'); return }
      setError('')
      setStep(2)
    } else if (step === 2) {
      setError('')
      setStep(3)
    }
  }

  async function handleSubmitAndPay() {
    setError('')
    if (!userInfo.email || !userInfo.firstName || !userInfo.lastName) {
      setError('Please fill in all required billing fields.')
      return
    }
    setPayLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Save order to DB
      const deadline = new Date()
      const urgencyHours: Record<string, number> = { '14d': 336, '7d': 168, '3d': 72, '48h': 48, '24h': 24, '12h': 12 }
      deadline.setHours(deadline.getHours() + (urgencyHours[form.urgency] || 168))

      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        title: form.title,
        paper_type: form.paper_type,
        subject: form.subject,
        academic_level: form.academic_level,
        pages: form.pages,
        deadline: deadline.toISOString(),
        instructions: form.instructions + (uploadedFile ? `\nFile: ${uploadedFile.name}` : ''),
        price: parseFloat(totalPrice.toFixed(2)),
        status: 'pending',
        payment_status: 'pending',
        user_id: user?.id || null,
      }).select().single()

      if (orderErr || !order) throw new Error(orderErr?.message || 'Failed to create order')
      setSavedOrderId(order.id)

      // Initiate PesaPal payment
      const payRes = await fetch('/api/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: totalPrice.toFixed(2),
          description: `StudyFlowHQ - ${form.paper_type}: ${form.title}`,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phone: userInfo.phone,
        }),
      })
      const payData = await payRes.json()

      if (payData.redirectUrl) {
        setPaymentUrl(payData.redirectUrl)
        window.location.href = payData.redirectUrl
      } else {
        throw new Error(payData.error || 'Payment initialization failed')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setPayLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(8,15,30,0.8)',
    border: '1.5px solid rgba(0,229,255,0.15)',
    borderRadius: 10,
    padding: '0.8rem 1.1rem',
    color: '#eef2f7',
    fontSize: '0.9rem',
    fontFamily: 'Outfit, sans-serif',
    outline: 'none',
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--navy)', paddingBottom: '4rem' }}>
        
        {/* Hero */}
        <div style={{ background: 'linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 100%)', borderBottom: '1px solid rgba(0,229,255,0.08)', padding: '3rem 1.5rem 2.5rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 100, padding: '0.3rem 1rem', fontSize: '0.78rem', color: '#00ff87', fontWeight: 600, marginBottom: '1rem' }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, background: '#00ff87', borderRadius: '50%', display: 'inline-block' }}></span>
              47 writers online now
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Place Your Order
            </h1>
            <p style={{ color: '#8892a4', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
              Upload your brief, get an instant price, and pay securely. Writers start within minutes.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ maxWidth: 760, margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {[
              { n: 1, label: 'Assignment Details' },
              { n: 2, label: 'Review & Quote' },
              { n: 3, label: 'Secure Payment' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className={`step-dot ${step > s.n ? 'done' : step === s.n ? 'active' : 'inactive'}`}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: step === s.n ? 700 : 500, color: step === s.n ? '#eef2f7' : '#8892a4', whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? 'var(--cyan)' : 'rgba(0,229,255,0.1)', margin: '0 0.75rem', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="fade-in" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 10, padding: '0.9rem 1.2rem', marginBottom: '1.5rem', color: '#ff4d6d', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠ {error}
            </div>
          )}

          {/* ─── STEP 1: Details ─── */}
          {step === 1 && (
            <div className="fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              
              {/* File Upload */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📎 <span>Upload Your Brief <span style={{ color: '#8892a4', fontWeight: 400, fontSize: '0.85rem' }}>(optional but recommended)</span></span>
                </div>
                <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.odt"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  {uploadedFile ? (
                    <div className="fade-in">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{uploadedFile.name}</div>
                      <div style={{ color: '#8892a4', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {(uploadedFile.size / 1024).toFixed(0)} KB
                      </div>
                      {detecting ? (
                        <div style={{ color: '#00E5FF', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                          <span className="spin" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(0,229,255,0.3)', borderTopColor: '#00E5FF', borderRadius: '50%' }}></span>
                          Detecting pages...
                        </div>
                      ) : detectedPages ? (
                        <div style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 8, padding: '0.4rem 0.8rem', display: 'inline-block', color: '#00ff87', fontSize: '0.82rem', fontWeight: 600 }}>
                          ✓ {detectedPages} pages detected ({detectedPages * 275} words)
                        </div>
                      ) : null}
                      <div style={{ marginTop: '0.75rem', color: '#8892a4', fontSize: '0.78rem' }}>Click to replace</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>☁</div>
                      <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Drop your file here or click to browse</div>
                      <div style={{ color: '#8892a4', fontSize: '0.82rem' }}>PDF, DOC, DOCX, TXT — up to 50MB</div>
                      <div style={{ marginTop: '0.75rem', color: '#00E5FF', fontSize: '0.78rem', fontWeight: 600 }}>✦ We auto-detect page count from your document</div>
                    </>
                  )}
                </div>
              </div>

              {/* Paper Details */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📝 Assignment Details</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label className="field-label">Assignment Title / Topic *</label>
                    <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. The Impact of Social Media on Mental Health Among Gen Z" style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Paper Type</label>
                      <select className="input" style={inputStyle} value={form.paper_type} onChange={e => setForm({...form, paper_type: e.target.value})}>
                        {PAPER_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Subject Area</label>
                      <select className="input" style={inputStyle} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Academic Level</label>
                      <select className="input" style={inputStyle} value={form.academic_level} onChange={e => setForm({...form, academic_level: e.target.value})}>
                        {LEVELS.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Citation Style</label>
                      <select className="input" style={inputStyle} value={form.citation} onChange={e => setForm({...form, citation: e.target.value})}>
                        {['APA','MLA','Chicago','Harvard','IEEE','Turabian','Oxford'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages, Deadline, Spacing */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📐 Scope & Deadline</div>
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  {/* Pages */}
                  <div>
                    <label className="field-label">Number of Pages <span style={{ color: '#8892a4' }}>(1 page = 275 words)</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button type="button" onClick={() => setForm(f => ({...f, pages: Math.max(1, f.pages - 1)}))}
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid rgba(0,229,255,0.2)', background: 'transparent', color: '#00E5FF', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <div style={{ textAlign: 'center', minWidth: 80 }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00E5FF' }}>{form.pages}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{form.pages * 275} words</div>
                      </div>
                      <button type="button" onClick={() => setForm(f => ({...f, pages: f.pages + 1}))}
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid rgba(0,229,255,0.2)', background: 'transparent', color: '#00E5FF', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <input type="range" min={1} max={100} value={form.pages} onChange={e => setForm({...form, pages: parseInt(e.target.value)})} style={{ flex: 1, accentColor: '#00E5FF' }} />
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="field-label">Deadline</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                      {Object.entries(URGENCY).map(([key, val]) => (
                        <button key={key} type="button"
                          onClick={() => setForm({...form, urgency: key})}
                          style={{
                            padding: '0.7rem', borderRadius: 10,
                            border: form.urgency === key ? '1.5px solid #00E5FF' : '1.5px solid rgba(0,229,255,0.12)',
                            background: form.urgency === key ? 'rgba(0,229,255,0.1)' : 'transparent',
                            color: form.urgency === key ? '#00E5FF' : '#8892a4',
                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                          }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{val.label}</div>
                          {val.mult > 1 && <div style={{ fontSize: '0.7rem', color: form.urgency === key ? 'rgba(0,229,255,0.7)' : '#8892a4' }}>+{Math.round((val.mult-1)*100)}%</div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing & Sources */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Spacing</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['single','double'].map(s => (
                          <button key={s} type="button" onClick={() => setForm({...form, spacing: s})}
                            style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: form.spacing === s ? '1.5px solid #00E5FF' : '1.5px solid rgba(0,229,255,0.12)', background: form.spacing === s ? 'rgba(0,229,255,0.1)' : 'transparent', color: form.spacing === s ? '#00E5FF' : '#8892a4', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Min. Sources</label>
                      <select className="input" style={inputStyle} value={form.sources} onChange={e => setForm({...form, sources: parseInt(e.target.value)})}>
                        {[0,1,2,3,5,7,10,15,20].map(n => <option key={n} value={n}>{n === 0 ? 'None' : n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <label className="field-label">Additional Instructions</label>
                <textarea className="input" style={{...inputStyle, minHeight: 100, marginTop: '0.4rem'}} value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} placeholder="Any specific requirements, guidelines from your professor, formatting preferences, or special notes for the writer..." />
              </div>

              <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>
                Continue to Review →
              </button>
            </div>
          )}

          {/* ─── STEP 2: Review & Quote ─── */}
          {step === 2 && (
            <div className="fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="card animate-border-glow" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8892a4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Your Instant Quote</div>
                  <div style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
                    <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ color: '#8892a4', fontSize: '0.85rem', marginTop: '0.25rem' }}>USD · Includes 5% service fee</div>
                </div>

                {/* Price breakdown */}
                <div style={{ background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Base price', value: `${form.pages} pages × $${PRICES[form.academic_level].toFixed(2)}`, amount: (PRICES[form.academic_level] * form.pages).toFixed(2) },
                    { label: `Urgency (${URGENCY[form.urgency].label})`, value: URGENCY[form.urgency].mult > 1 ? `+${Math.round((URGENCY[form.urgency].mult-1)*100)}%` : 'Standard rate', amount: ((PRICES[form.academic_level] * form.pages * URGENCY[form.urgency].mult) - (PRICES[form.academic_level] * form.pages)).toFixed(2) },
                    { label: 'Service fee', value: '5%', amount: serviceFee.toFixed(2) },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{item.value}</div>
                      </div>
                      <div style={{ color: '#00E5FF', fontWeight: 700 }}>${item.amount}</div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', fontWeight: 800 }}>
                    <span>Total</span>
                    <span style={{ color: '#00ff87', fontSize: '1.2rem' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { icon: '📝', label: 'Type', val: form.paper_type },
                    { icon: '📚', label: 'Subject', val: form.subject },
                    { icon: '🎓', label: 'Level', val: LEVELS.find(l => l.v === form.academic_level)?.l || '' },
                    { icon: '📄', label: 'Pages', val: `${form.pages} (${form.pages * 275} words)` },
                    { icon: '⏰', label: 'Deadline', val: URGENCY[form.urgency].label },
                    { icon: '📖', label: 'Citation', val: form.citation },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(0,229,255,0.03)', borderRadius: 10, padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#8892a4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.icon} {item.label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '0.2rem' }}>{item.val}</div>
                    </div>
                  ))}
                </div>

                {uploadedFile && (
                  <div style={{ marginTop: '1rem', background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.15)', borderRadius: 10, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📎</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#00ff87' }}>{uploadedFile.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{detectedPages ? `${detectedPages} pages auto-detected` : `${(uploadedFile.size/1024).toFixed(0)} KB`}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { icon: '🔒', title: '100% Secure', desc: 'Encrypted payments' },
                  { icon: '✍️', title: 'Original Work', desc: 'Plagiarism-free' },
                  { icon: '🔄', title: 'Free Revisions', desc: 'Unlimited for 30 days' },
                ].map(g => (
                  <div key={g.title} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{g.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{g.title}</div>
                    <div style={{ color: '#8892a4', fontSize: '0.75rem' }}>{g.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button className="btn-outline" onClick={() => setStep(1)} style={{ width: '100%', justifyContent: 'center' }}>← Edit Details</button>
                <button className="btn-green" onClick={() => setStep(3)} style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Payment →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Payment ─── */}
          {step === 3 && (
            <div className="fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              {/* Billing info */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  👤 Billing Information
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">First Name *</label>
                      <input className="input" style={inputStyle} value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} placeholder="John" />
                    </div>
                    <div>
                      <label className="field-label">Last Name *</label>
                      <input className="input" style={inputStyle} value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Email Address * <span style={{ color: '#8892a4', fontWeight: 400 }}>(order confirmation sent here)</span></label>
                    <input className="input" type="email" style={inputStyle} value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="field-label">Phone Number <span style={{ color: '#8892a4', fontWeight: 400 }}>(optional, for M-Pesa)</span></label>
                    <input className="input" type="tel" style={inputStyle} value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>
              </div>

              {/* Payment summary */}
              <div className="card-glow" style={{ padding: '1.75rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💳 Order Summary
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{form.paper_type}: {form.title.substring(0, 50)}{form.title.length > 50 ? '...' : ''}</div>
                    <div style={{ color: '#8892a4', fontSize: '0.82rem', marginTop: '0.25rem' }}>{form.pages} pages · {URGENCY[form.urgency].label} · {LEVELS.find(l => l.v === form.academic_level)?.l}</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00ff87' }}>${totalPrice.toFixed(2)}</div>
                </div>

                {/* Payment methods note */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#8892a4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Accepted Payment Methods</div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {['M-Pesa', 'Visa', 'Mastercard', 'Airtel Money'].map(m => (
                      <div key={m} style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 6, padding: '0.3rem 0.7rem', fontSize: '0.78rem', fontWeight: 600, color: '#c4cdd8' }}>{m}</div>
                    ))}
                  </div>
                </div>

                {/* Security badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(0,255,135,0.04)', borderRadius: 10, border: '1px solid rgba(0,255,135,0.1)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔒</span>
                  <div style={{ fontSize: '0.8rem', color: '#8892a4' }}>
                    <span style={{ color: '#00ff87', fontWeight: 600 }}>256-bit SSL secured</span> · Powered by PesaPal · Your payment info is never stored
                  </div>
                </div>

                <button
                  className="btn-green"
                  onClick={handleSubmitAndPay}
                  disabled={payLoading}
                  style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', fontSize: '1.05rem' }}
                >
                  {payLoading ? (
                    <>
                      <span className="spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(8,15,30,0.3)', borderTopColor: '#080f1e', borderRadius: '50%' }}></span>
                      Redirecting to PesaPal...
                    </>
                  ) : (
                    <>🔒 Pay ${totalPrice.toFixed(2)} Securely</>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: '#8892a4' }}>
                  You will be redirected to PesaPal to complete payment
                </div>
              </div>

              <button className="btn-outline" onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center' }}>← Back to Review</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
