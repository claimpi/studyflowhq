import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: '#AAB4C0', assigned: '#00E5FF', in_progress: '#39FF88',
  review: '#FFD700', completed: '#39FF88', cancelled: '#ff8080',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const stats = {
    total: orders?.length || 0,
    active: orders?.filter(o => ['pending','assigned','in_progress'].includes(o.status)).length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0,
    spent: orders?.filter(o => o.status === 'completed').reduce((s, o) => s + (o.price || 0), 0).toFixed(2) || '0.00',
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Student'}</span>
            </h1>
            <p style={{ color: '#AAB4C0' }}>Here's a summary of your orders.</p>
          </div>
          <Link href="/order" className="btn-primary">+ New Order</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Orders', value: stats.total, color: '#AAB4C0' },
            { label: 'Active Orders', value: stats.active, color: '#00E5FF' },
            { label: 'Completed', value: stats.completed, color: '#39FF88' },
            { label: 'Total Spent', value: `$${stats.spent}`, color: '#FFD700' },
          ].map(s => (
            <div key={s.label} className="card-glass" style={{ borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#AAB4C0', fontSize: '0.8rem', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card-glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,229,255,0.1)', fontWeight: 700 }}>My Orders</div>
          {!orders?.length ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#AAB4C0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
              <div>No orders yet. <Link href="/order" style={{ color: '#00E5FF', textDecoration: 'none' }}>Place your first order →</Link></div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(170,180,192,0.1)' }}>
                    {['Topic','Type','Pages','Deadline','Price','Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', color: '#AAB4C0', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(170,180,192,0.06)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#AAB4C0', fontSize: '0.85rem' }}>{o.paper_type}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#AAB4C0', fontSize: '0.85rem' }}>{o.pages}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#AAB4C0', fontSize: '0.85rem' }}>{new Date(o.deadline).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#00E5FF', fontWeight: 600, fontSize: '0.9rem' }}>${o.price}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status], border: `1px solid ${statusColors[o.status]}40`, borderRadius: 100, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{o.status.replace('_',' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
