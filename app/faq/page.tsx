'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const faqs = [
  {q:'Is this plagiarism?',a:'No. We provide custom academic writing assistance, similar to tutoring. The work we provide is meant to be used as a study guide, model paper, or reference. It is your responsibility to follow your institution\'s academic integrity policy.'},
  {q:'How is the price calculated?',a:'Price is based on academic level, number of pages, and deadline urgency. Undergraduate papers start at $13.50/page. Rush orders (under 48 hours) carry a surcharge. Use our live calculator on the pricing page for an exact quote.'},
  {q:'What payment methods do you accept?',a:'We accept M-Pesa, Visa, Mastercard, and Airtel Money through PesaPal — a secure East African payment gateway. All transactions are encrypted and you are never charged hidden fees.'},
  {q:'How quickly can you complete an order?',a:'We accept orders with deadlines as short as 12 hours. For complex work like dissertations, we strongly recommend at least 7 days. Rush orders are available at a premium to cover writer availability.'},
  {q:'Can I communicate with my writer?',a:'Yes. Once your order is assigned, you can send additional instructions or clarifications via email to info@studyflowhq.com referencing your order number. Your writer will receive them through our admin portal.'},
  {q:'What if I\'m not satisfied?',a:'We offer unlimited free revisions within 30 days of delivery. If you are genuinely unsatisfied and the paper does not meet the original requirements you submitted, you are eligible for a full refund.'},
  {q:'Is my information kept confidential?',a:'Absolutely. We never share your name, email, or order details with any third party. Your identity is fully protected. Writers do not know who you are — they only see the assignment requirements.'},
  {q:'What subjects do you cover?',a:'We cover virtually every undergraduate and postgraduate subject: Literature, History, Business, Law, Economics, Psychology, Nursing, Biology, Computer Science, Engineering, Mathematics, and more.'},
  {q:'Do you handle dissertations?',a:'Yes. Dissertations are one of our most requested paper types. We can handle single chapters, full dissertations, literature reviews, methodology sections, and data analysis. Start with plenty of time for best results.'},
  {q:'How do I receive my completed paper?',a:'Once your paper is complete, the status in your dashboard updates to "Completed" and you receive an email notification. You can download the paper directly from your dashboard at studyflowhq.com/dashboard.'},
  {q:'Can I request a specific writer?',a:'Yes. If you have worked with a writer before and want them again, mention this in your order instructions along with the writer\'s name and we will do our best to assign them to your order.'},
  {q:'Do you use AI writing tools?',a:'No. All papers are written by human academic writers. We do not use AI-generated content. Our writers are vetted professionals with verified academic qualifications.'},
]

export default function FAQPage() {
  const [open,setOpen]=useState<number|null>(null)
  const F:React.CSSProperties={fontFamily:'Outfit,sans-serif'}

  return(<><Navbar />
    <div style={{background:'#080f1e',minHeight:'100vh',...F}}>
      <div style={{textAlign:'center',padding:'4rem 1.5rem 3rem',borderBottom:'1px solid rgba(0,229,255,0.08)'}}>
        <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#eef2f7',letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
          Frequently Asked <span style={{background:'linear-gradient(135deg,#00E5FF,#00ff87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Questions</span>
        </h1>
        <p style={{color:'#8892a4',maxWidth:480,margin:'0 auto'}}>Everything you need to know before placing your order.</p>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <div style={{display:'grid',gap:'0.75rem',marginBottom:'3rem'}}>
          {faqs.map((faq,i)=>(
            <div key={i} style={{background:'#0e1a2e',border:`1px solid ${open===i?'rgba(0,229,255,0.25)':'rgba(0,229,255,0.1)'}`,borderRadius:14,overflow:'hidden',transition:'border-color 0.2s'}}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{width:'100%',padding:'1.1rem 1.25rem',background:'transparent',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',fontFamily:'Outfit,sans-serif'}}>
                <span style={{fontWeight:700,fontSize:'0.92rem',color:'#eef2f7',textAlign:'left'}}>{faq.q}</span>
                <span style={{color:'#00E5FF',fontSize:'1.1rem',flexShrink:0,transition:'transform 0.2s',transform:open===i?'rotate(45deg)':'none'}}>+</span>
              </button>
              {open===i&&(
                <div style={{padding:'0 1.25rem 1.25rem'}}>
                  <div style={{height:1,background:'rgba(0,229,255,0.1)',marginBottom:'1rem'}} />
                  <p style={{color:'#8892a4',fontSize:'0.88rem',lineHeight:1.7,margin:0}}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{background:'rgba(0,229,255,0.04)',border:'1px solid rgba(0,229,255,0.12)',borderRadius:20,padding:'2.5rem',textAlign:'center'}}>
          <div style={{fontSize:'1.5rem',marginBottom:'0.75rem'}}>💬</div>
          <h3 style={{fontWeight:800,color:'#eef2f7',marginBottom:'0.5rem'}}>Still have questions?</h3>
          <p style={{color:'#8892a4',fontSize:'0.88rem',marginBottom:'1.25rem'}}>Our team responds within 2 hours on weekdays.</p>
          <a href="mailto:info@studyflowhq.com" style={{display:'inline-block',background:'linear-gradient(135deg,#00E5FF,#00b8cc)',color:'#080f1e',padding:'0.75rem 2rem',borderRadius:10,textDecoration:'none',fontWeight:800,fontSize:'0.9rem',marginRight:'0.75rem'}}>
            Email Us
          </a>
          <Link href="/order" style={{display:'inline-block',border:'1.5px solid rgba(0,229,255,0.3)',color:'#00E5FF',padding:'0.75rem 2rem',borderRadius:10,textDecoration:'none',fontWeight:700,fontSize:'0.9rem'}}>
            Place Order
          </Link>
        </div>
      </div>
    </div>
    <Footer /></>
  )
}
