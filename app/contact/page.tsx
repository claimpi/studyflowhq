'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''})
  const [sent,setSent]=useState(false)
  const [loading,setLoading]=useState(false)
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}
  const inp:React.CSSProperties={width:'100%',background:'rgba(8,15,30,0.8)',border:'1.5px solid rgba(0,229,255,0.15)',borderRadius:10,padding:'0.8rem 1.1rem',color:'#eef2f7',fontSize:'0.9rem',fontFamily:'Outfit,sans-serif',outline:'none'}
  const lbl:React.CSSProperties={display:'block',color:'#8892a4',fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.4rem'}

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    await fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'contact',...form})}).catch(()=>{})
    setTimeout(()=>{setSent(true);setLoading(false)},800)
  }

  return(<><Navbar />
    <div style={{background:'#080f1e',minHeight:'100vh',...F}}>
      <div style={{textAlign:'center',padding:'4rem 1.5rem 3rem',borderBottom:'1px solid rgba(0,229,255,0.08)'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#eef2f7',letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
          Get in <span style={{background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Touch</span>
        </h1>
        <p style={{color:'#8892a4',maxWidth:460,margin:'0 auto'}}>Have a question about your order? Want to become a writer? We respond within 2 hours.</p>
      </div>

      <div style={{maxWidth:800,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'2rem'}}>
          {/* Contact info */}
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[
              {icon:'📧',title:'Email',value:'info@studyflowhq.com',href:'mailto:info@studyflowhq.com'},
              {icon:'⏰',title:'Response Time',value:'Within 2 hours on weekdays',href:null},
              {icon:'🌍',title:'We Serve',value:'Students worldwide',href:null},
            ].map(c=>(
              <div key={c.title} style={{background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.1)',borderRadius:14,padding:'1.25rem',display:'flex',gap:'0.9rem',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.4rem'}}>{c.icon}</span>
                <div>
                  <div style={{fontWeight:700,color:'#eef2f7',fontSize:'0.9rem',marginBottom:'0.2rem'}}>{c.title}</div>
                  {c.href ? <a href={c.href} style={{color:'#00E5FF',fontSize:'0.85rem',textDecoration:'none'}}>{c.value}</a>
                    : <div style={{color:'#8892a4',fontSize:'0.85rem'}}>{c.value}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <div style={{background:'#0e1a2e',border:'1px solid rgba(0,255,135,0.2)',borderRadius:20,padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
              <h3 style={{fontWeight:800,color:'#eef2f7',marginBottom:'0.5rem'}}>Message sent!</h3>
              <p style={{color:'#8892a4',fontSize:'0.9rem'}}>We'll reply to <strong style={{color:'#00E5FF'}}>{form.email}</strong> within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.15)',borderRadius:20,padding:'1.75rem',display:'grid',gap:'1rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div><label style={lbl}>Name</label><input required style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
                <div><label style={lbl}>Email</label><input required type="email" style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com" /></div>
              </div>
              <div>
                <label style={lbl}>Subject</label>
                <select required style={{...inp}} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                  <option value="">Select a topic...</option>
                  {['Order question','Payment issue','Revision request','Become a writer','General enquiry','Other'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Message</label>
                <textarea required style={{...inp,minHeight:120,resize:'vertical'}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us how we can help..." />
              </div>
              <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',border:'none',padding:'0.9rem',borderRadius:10,fontWeight:800,fontSize:'0.95rem',fontFamily:'Outfit,sans-serif',cursor:'pointer',opacity:loading?0.7:1}}>
                {loading?'Sending...':'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    <Footer /></>
  )
}
