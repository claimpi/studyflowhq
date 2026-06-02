'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const BASE:Record<string,number> = {high_school:10.80,undergraduate:13.50,masters:16.00,phd:20.00}
const URGENCY:Record<string,{label:string;mult:number}> = {'14d':{label:'14 Days',mult:1},'7d':{label:'7 Days',mult:1.15},'3d':{label:'3 Days',mult:1.3},'48h':{label:'48 Hours',mult:1.5},'24h':{label:'24 Hours',mult:1.75},'12h':{label:'12 Hours',mult:2}}

export default function PricingPage() {
  const [level,setLevel]=useState('undergraduate')
  const [pages,setPages]=useState(1)
  const [urgency,setUrgency]=useState('7d')
  const total = BASE[level]*pages*URGENCY[urgency].mult*1.05
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}
  const card:React.CSSProperties={background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.1)',borderRadius:14,padding:'1.25rem',textAlign:'center'}

  return(<><Navbar />
    <div style={{background:'#080f1e',minHeight:'100vh',...F}}>
      <div style={{textAlign:'center',padding:'4rem 1.5rem 3rem',borderBottom:'1px solid rgba(0,229,255,0.08)'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#eef2f7',letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
          Transparent <span style={{background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Pricing</span>
        </h1>
        <p style={{color:'#8892a4',maxWidth:480,margin:'0 auto'}}>No hidden fees. No subscriptions. Pay only per paper, starting from $10.80/page.</p>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 1.5rem'}}>
        {/* Calculator */}
        <div style={{background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.2)',borderRadius:20,padding:'2rem',marginBottom:'3rem'}}>
          <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
            <div style={{fontSize:'0.78rem',color:'#8892a4',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>Live Price Calculator</div>
            <div style={{fontSize:'4rem',fontWeight:900,background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'-0.04em'}}>${total.toFixed(2)}</div>
            <div style={{color:'#8892a4',fontSize:'0.85rem'}}>USD · includes 5% service fee</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem'}}>
            <div>
              <label style={{display:'block',color:'#8892a4',fontSize:'0.73rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem'}}>Academic Level</label>
              {[['high_school','High School','$10.80'],['undergraduate','Undergraduate','$13.50'],['masters',"Master's",'$16.00'],['phd','PhD','$20.00']].map(([v,l,p])=>(
                <button key={v} onClick={()=>setLevel(v)} style={{width:'100%',marginBottom:'0.5rem',padding:'0.65rem 1rem',borderRadius:8,border:`1.5px solid ${level===v?'#00E5FF':'rgba(0,229,255,0.12)'}`,background:level===v?'rgba(0,229,255,0.1)':'transparent',color:level===v?'#00E5FF':'#8892a4',cursor:'pointer',fontFamily:'Outfit,sans-serif',display:'flex',justifyContent:'space-between',fontSize:'0.88rem',fontWeight:600}}>
                  <span>{l}</span><span style={{opacity:0.7,fontSize:'0.75rem'}}>{p}/pg</span>
                </button>
              ))}
            </div>
            <div>
              <label style={{display:'block',color:'#8892a4',fontSize:'0.73rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem'}}>Deadline</label>
              {Object.entries(URGENCY).map(([k,v])=>(
                <button key={k} onClick={()=>setUrgency(k)} style={{width:'100%',marginBottom:'0.5rem',padding:'0.65rem 1rem',borderRadius:8,border:`1.5px solid ${urgency===k?'#00E5FF':'rgba(0,229,255,0.12)'}`,background:urgency===k?'rgba(0,229,255,0.1)':'transparent',color:urgency===k?'#00E5FF':'#8892a4',cursor:'pointer',fontFamily:'Outfit,sans-serif',display:'flex',justifyContent:'space-between',fontSize:'0.88rem',fontWeight:600}}>
                  <span>{v.label}</span>{v.mult>1&&<span style={{fontSize:'0.72rem',opacity:0.7}}>+{Math.round((v.mult-1)*100)}%</span>}
                </button>
              ))}
            </div>
            <div>
              <label style={{display:'block',color:'#8892a4',fontSize:'0.73rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem'}}>Pages: {pages} ({pages*275} words)</label>
              <input type="range" min={1} max={50} value={pages} onChange={e=>setPages(+e.target.value)} style={{width:'100%',accentColor:'#00E5FF',margin:'1rem 0'}} />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'1rem'}}>
                {[[1,'1p'],[3,'3p'],[5,'5p'],[10,'10p']].map(([n,l])=>(
                  <button key={n} onClick={()=>setPages(+n)} style={{padding:'0.5rem',borderRadius:8,border:`1.5px solid ${pages===n?'#00E5FF':'rgba(0,229,255,0.12)'}`,background:pages===n?'rgba(0,229,255,0.1)':'transparent',color:pages===n?'#00E5FF':'#8892a4',cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:'0.78rem',fontWeight:600}}>
                    {l}
                  </button>
                ))}
              </div>
              <Link href="/order" style={{display:'block',background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',textAlign:'center',padding:'0.9rem',borderRadius:10,textDecoration:'none',fontWeight:800,fontSize:'1rem'}}>
                Order for ${total.toFixed(2)} →
              </Link>
            </div>
          </div>
        </div>

        {/* Included */}
        <h2 style={{textAlign:'center',fontSize:'1.8rem',fontWeight:800,color:'#eef2f7',marginBottom:'1.5rem'}}>Every Order Includes</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'3rem'}}>
          {[['📄','100% Original','Plagiarism-free, written from scratch'],['🔄','Free Revisions','Unlimited within 30 days'],['🎓','Expert Writers','PhD/MSc qualified in your subject'],['⏰','On-Time','97% on-time — money back guarantee'],['🔒','Confidential','Your identity is never shared'],['💬','24/7 Support','Email us at info@studyflowhq.com']].map(([i,t,d])=>(
            <div key={t} style={card}><div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{i}</div><div style={{fontWeight:700,color:'#eef2f7',marginBottom:'0.3rem',fontSize:'0.9rem'}}>{t}</div><div style={{color:'#8892a4',fontSize:'0.78rem',lineHeight:1.5}}>{d}</div></div>
          ))}
        </div>

        <div style={{textAlign:'center',background:'rgba(0,229,255,0.04)',border:'1px solid rgba(0,229,255,0.12)',borderRadius:20,padding:'3rem'}}>
          <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#eef2f7',marginBottom:'0.75rem'}}>No registration needed</h2>
          <p style={{color:'#8892a4',marginBottom:'1.5rem'}}>Just place an order, pay securely, and download your paper.</p>
          <Link href="/order" style={{display:'inline-block',background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',padding:'0.9rem 2.5rem',borderRadius:10,textDecoration:'none',fontWeight:800,fontSize:'1rem'}}>Place Your Order ✦</Link>
        </div>
      </div>
    </div>
    <Footer /></>
  )
}
