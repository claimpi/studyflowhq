import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
export default function Page() {
  return (<><Navbar /><div style={{background:'#080f1e',minHeight:'100vh',maxWidth:760,margin:'0 auto',padding:'4rem 1.5rem',fontFamily:'Outfit,sans-serif',color:'#c4cdd8',lineHeight:1.7}}>
    <h1 style={{fontSize:'2rem',fontWeight:900,color:'#eef2f7',marginBottom:'2rem',textTransform:'capitalize'}}>privacy Policy</h1>
    <p>For questions about this policy, contact <a href="mailto:info@studyflowhq.com" style={{color:'#00E5FF'}}>info@studyflowhq.com</a>.</p>
  </div><Footer /></>)
}
