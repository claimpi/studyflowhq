"use client"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}
  const card:React.CSSProperties={background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.1)',borderRadius:16,padding:'1.5rem'}

  return(<><Navbar />
    <div style={{background:'#080f1e',minHeight:'100vh',...F}}>
      <div style={{textAlign:'center',padding:'4rem 1.5rem 3rem',borderBottom:'1px solid rgba(0,229,255,0.08)'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#eef2f7',letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
          About <span style={{background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>StudyFlowHQ</span>
        </h1>
        <p style={{color:'#8892a4',maxWidth:560,margin:'0 auto',fontSize:'1rem',lineHeight:1.7}}>
          We connect students with qualified academic writers to help them achieve their academic goals — faster, smarter, and with less stress.
        </p>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'3rem 1.5rem'}}>
        {/* Mission */}
        <div style={{...card,marginBottom:'2rem',borderColor:'rgba(0,229,255,0.2)'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:'1.25rem'}}>
            <div style={{fontSize:'2.5rem',flexShrink:0}}>🎯</div>
            <div>
              <h2 style={{fontWeight:800,color:'#eef2f7',marginBottom:'0.5rem',fontSize:'1.3rem'}}>Our Mission</h2>
              <p style={{color:'#8892a4',lineHeight:1.7,margin:0}}>
                Academic writing is hard. Deadlines pile up, subject knowledge gaps appear, and the pressure to perform can be overwhelming. StudyFlowHQ exists to give every student access to expert-level writing support — regardless of their location, budget, or timeline. We believe quality academic assistance should be transparent, affordable, and easy to access.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <h2 style={{textAlign:'center',fontSize:'1.5rem',fontWeight:800,color:'#eef2f7',marginBottom:'1.5rem'}}>What We Stand For</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1rem',marginBottom:'3rem'}}>
          {[
            {icon:'🔬',title:'Academic Excellence',desc:'Every writer is vetted. We only work with degree-qualified professionals who demonstrate subject mastery.'},
            {icon:'🔒',title:'Privacy First',desc:'Your identity is never revealed to writers or third parties. Full anonymity, always.'},
            {icon:'⚡',title:'Reliability',desc:'97% on-time delivery rate. If your paper is late due to our fault, you get a refund.'},
            {icon:'💡',title:'Transparency',desc:'No hidden fees, no subscription traps. You see the price before you pay — always.'},
          ].map(v=>(
            <div key={v.title} style={card}>
              <div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{v.icon}</div>
              <div style={{fontWeight:700,color:'#eef2f7',marginBottom:'0.4rem'}}>{v.title}</div>
              <div style={{color:'#8892a4',fontSize:'0.82rem',lineHeight:1.6}}>{v.desc}</div>
            </div>
          ))}
        </div>

        {/* Writers */}
        <div style={{...card,marginBottom:'2rem',borderColor:'rgba(0,255,135,0.15)'}}>
          <h2 style={{fontWeight:800,color:'#eef2f7',marginBottom:'0.75rem',fontSize:'1.3rem'}}>Our Writer Network</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'0.75rem'}}>
            {[['500+','Verified writers'],['25+','Subject areas'],['4.9★','Average rating'],['10+','Years combined experience']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center',background:'rgba(0,229,255,0.04)',borderRadius:10,padding:'1rem'}}>
                <div style={{fontSize:'1.6rem',fontWeight:900,color:'#00E5FF'}}>{v}</div>
                <div style={{color:'#8892a4',fontSize:'0.75rem',marginTop:'0.25rem'}}>{l}</div>
              </div>
            ))}
          </div>
          <p style={{color:'#8892a4',fontSize:'0.85rem',lineHeight:1.6,margin:0}}>
            All writers hold at least a Master's degree in their field. Every writer completes a rigorous application process including a sample writing test, subject knowledge assessment, and identity verification before joining our network.
          </p>
        </div>

        {/* Contact */}
        <div style={{background:'rgba(0,229,255,0.04)',border:'1px solid rgba(0,229,255,0.12)',borderRadius:20,padding:'2.5rem',textAlign:'center'}}>
          <h2 style={{fontWeight:800,color:'#eef2f7',marginBottom:'0.5rem'}}>Get in touch</h2>
          <p style={{color:'#8892a4',marginBottom:'1.25rem',fontSize:'0.9rem'}}>Questions, partnerships, or writer applications — we read every email.</p>
          <a href="mailto:info@studyflowhq.com" style={{color:'#00E5FF',fontWeight:700,fontSize:'1rem',textDecoration:'none'}}>info@studyflowhq.com</a>
          <div style={{marginTop:'1.5rem',display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/order" style={{background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',padding:'0.75rem 2rem',borderRadius:10,textDecoration:'none',fontWeight:800,fontSize:'0.9rem'}}>Place an Order</Link>
            <Link href="/faq" style={{border:'1.5px solid rgba(0,229,255,0.3)',color:'#00E5FF',padding:'0.75rem 2rem',borderRadius:10,textDecoration:'none',fontWeight:700,fontSize:'0.9rem'}}>View FAQ</Link>
          </div>
        </div>
      </div>
    </div>
    <Footer /></>
  )
}
