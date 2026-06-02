import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const reviews = [
  {name:'James K.',country:'🇰🇪',subject:'Business Management',rating:5,date:'Dec 2024',text:'Absolutely outstanding work on my MBA dissertation. The writer understood exactly what was needed, cited all sources correctly in Harvard style, and delivered 2 days early. My supervisor was very impressed.'},
  {name:'Amara N.',country:'🇬🇧',subject:'Nursing',rating:5,date:'Jan 2025',text:'I was struggling with my clinical case study assignment. The writer had real nursing knowledge and the paper was so well-structured. Definitely using StudyFlowHQ again for my final year.'},
  {name:'David M.',country:'🇿🇦',subject:'Computer Science',rating:5,date:'Nov 2024',text:'Needed a Python data analysis project on short notice — 48 hours. Delivered clean, commented code with a full report. Got a distinction. Incredible service.'},
  {name:'Priya R.',country:'🇮🇳',subject:'Law',rating:5,date:'Feb 2025',text:'My contract law essay was handled by someone who clearly knows international law. Proper legal citations, well-argued analysis. Submitted with full confidence.'},
  {name:'Sarah T.',country:'🇺🇸',subject:'Psychology',rating:5,date:'Mar 2025',text:'Research paper on cognitive behavioral therapy — the writer had real expertise in clinical psychology. APA formatting was perfect. Will be a regular customer.'},
  {name:'Mohamed A.',country:'🇹🇿',subject:'Economics',rating:4,date:'Jan 2025',text:'Good quality econometrics report. Requested one revision and it was done within hours. Responsive team. Price is fair for the quality.'},
  {name:'Grace O.',country:'🇳🇬',subject:'Literature',rating:5,date:'Dec 2024',text:'My literary analysis of Chinua Achebe was brilliant — the writer brought genuine cultural insight I could not have achieved alone. Highly recommended.'},
  {name:'Thomas H.',country:'🇦🇺',subject:'Engineering',rating:5,date:'Feb 2025',text:'Complex thermodynamics report written perfectly. The writer clearly had an engineering background. All calculations checked out. Delivered on time.'},
]

const stats = [
  {value:'4.9★',label:'Average rating'},
  {value:'97%',label:'On-time delivery'},
  {value:'15K+',label:'Completed orders'},
  {value:'94%',label:'Return customers'},
]

export default function ReviewsPage() {
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}
  return(<><Navbar />
    <div style={{background:'#080f1e',minHeight:'100vh',...F}}>
      <div style={{textAlign:'center',padding:'4rem 1.5rem 3rem',borderBottom:'1px solid rgba(0,229,255,0.08)'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#eef2f7',letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
          What Students <span style={{background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Say</span>
        </h1>
        <p style={{color:'#8892a4',maxWidth:480,margin:'0 auto'}}>Real reviews from students across the world. No fake reviews — just honest feedback.</p>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'3rem 1.5rem'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'3rem'}}>
          {stats.map(s=>(
            <div key={s.label} style={{background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.1)',borderRadius:14,padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',fontWeight:900,color:'#00E5FF'}}>{s.value}</div>
              <div style={{color:'#8892a4',fontSize:'0.82rem',marginTop:'0.25rem'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1.25rem',marginBottom:'3rem'}}>
          {reviews.map(r=>(
            <div key={r.name} style={{background:'#0e1a2e',border:'1px solid rgba(0,229,255,0.1)',borderRadius:16,padding:'1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#00E5FF,#00ff87)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'0.85rem',color:'#080f1e'}}>{r.name[0]}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.88rem'}}>{r.name} {r.country}</div>
                    <div style={{color:'#8892a4',fontSize:'0.75rem'}}>{r.subject} · {r.date}</div>
                  </div>
                </div>
                <div style={{color:'#ffd60a',fontSize:'0.9rem'}}>{'★'.repeat(r.rating)}</div>
              </div>
              <p style={{color:'#c4cdd8',fontSize:'0.85rem',lineHeight:1.6,margin:0}}>"{r.text}"</p>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',background:'rgba(0,229,255,0.04)',border:'1px solid rgba(0,229,255,0.12)',borderRadius:20,padding:'3rem'}}>
          <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#eef2f7',marginBottom:'0.75rem'}}>Join 15,000+ satisfied students</h2>
          <p style={{color:'#8892a4',marginBottom:'1.5rem'}}>Experience the quality for yourself.</p>
          <Link href="/order" style={{display:'inline-block',background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',padding:'0.9rem 2.5rem',borderRadius:10,textDecoration:'none',fontWeight:800,fontSize:'1rem'}}>Get Started ✦</Link>
        </div>
      </div>
    </div>
    <Footer /></>
  )
}
