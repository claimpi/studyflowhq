"use client"
import Link from 'next/link'

export default function Footer() {
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}
  const lnk:React.CSSProperties={color:'#8892a4',textDecoration:'none',fontSize:'0.85rem',display:'block',marginBottom:'0.5rem',transition:'color 0.2s'}

  return(
    <footer style={{background:'#060d18',borderTop:'1px solid rgba(0,229,255,0.08)',padding:'3.5rem 1.5rem 2rem',...F}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.5fr repeat(3,1fr)',gap:'2rem',marginBottom:'3rem'}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#00E5FF,#00ff87)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'0.9rem',color:'#080f1e'}}>S</div>
              <span style={{fontSize:'1.1rem',fontWeight:800,color:'#eef2f7',letterSpacing:'-0.02em'}}>StudyFlow<span style={{color:'#00E5FF'}}>HQ</span></span>
            </div>
            <p style={{color:'#8892a4',fontSize:'0.82rem',lineHeight:1.7,maxWidth:220,marginBottom:'1rem'}}>Professional academic writing assistance for students worldwide. Expert writers, on-time delivery, original work.</p>
            <a href="mailto:info@studyflowhq.com" style={{color:'#00E5FF',fontSize:'0.82rem',textDecoration:'none',fontWeight:600}}>info@studyflowhq.com</a>
          </div>

          {/* Services */}
          <div>
            <div style={{color:'#eef2f7',fontWeight:700,fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'1rem'}}>Services</div>
            {['Essay Writing','Research Papers','Dissertations','Coursework','Editing & Proofreading','Case Studies'].map(s=>(
              <Link key={s} href="/order" style={lnk} onMouseEnter={e=>(e.currentTarget.style.color='#00E5FF')} onMouseLeave={e=>(e.currentTarget.style.color='#8892a4')}>{s}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{color:'#eef2f7',fontWeight:700,fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'1rem'}}>Company</div>
            {[['About Us','/about'],['Our Writers','/writers'],['Reviews','/reviews'],['Pricing','/pricing'],['FAQ','/faq'],['Contact','/contact']].map(([l,h])=>(
              <Link key={l} href={h} style={lnk} onMouseEnter={e=>(e.currentTarget.style.color='#00E5FF')} onMouseLeave={e=>(e.currentTarget.style.color='#8892a4')}>{l}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{color:'#eef2f7',fontWeight:700,fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'1rem'}}>Legal</div>
            {[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Refund Policy','/refund'],['Cookie Policy','/cookies']].map(([l,h])=>(
              <Link key={l} href={h} style={lnk} onMouseEnter={e=>(e.currentTarget.style.color='#00E5FF')} onMouseLeave={e=>(e.currentTarget.style.color='#8892a4')}>{l}</Link>
            ))}
            <div style={{marginTop:'1rem',display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {['M-Pesa','Visa','Mastercard','Airtel'].map(m=>(
                <div key={m} style={{background:'rgba(0,229,255,0.06)',border:'1px solid rgba(0,229,255,0.12)',borderRadius:4,padding:'0.2rem 0.5rem',fontSize:'0.68rem',color:'#8892a4',fontWeight:600}}>{m}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid rgba(0,229,255,0.08)',paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{color:'#8892a4',fontSize:'0.78rem'}}>© {new Date().getFullYear()} StudyFlowHQ. All rights reserved.</div>
          <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#00ff87'}} />
            <span style={{color:'#8892a4',fontSize:'0.78rem'}}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
