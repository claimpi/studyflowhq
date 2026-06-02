import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: '#AAB4C0', assigned: '#00E5FF', in_progress: '#39FF88',
  review: '#FFD700', completed: '#39FF88', cancelled: '#ff8080',
}

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: orders } = await supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  const stats = {
    totalOrders: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    active: orders?.filter(o => ['assigned','in_progress'].includes(o.status)).length || 0,
    revenue: orders?.filter(o => o.status === 'completed').reduce((s, o) => s + (o.price || 0), 0).toFixed(2) || '0.00',
    totalUsers: users?.length || 0,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B1320' }}>
      {/* Admin Navbar */}
      <nav style={{ background: 'rgba(11,19,32,0.95)', borderBottom: '1px solid rgba(0,229,255,0.15)', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
          <span className="gradient-text">StudyFlowHQ</span> <span style={{ color: '#AAB4C0', fontSize: '0.8rem', fontWeight: 500 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#AAB4C0', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to site</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Dashboard</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { l: 'Total Orders', v: stats.totalOrders, c: '#AAB4C0' },
            { l: 'Pending', v: stats.pending, c: '#FFD700' },
            { l: 'Active', v: stats.active, c: '#00E5FF' },
            { l: 'Revenue', v: `$${stats.revenue}`, c: '#39FF88' },
            { l: 'Users', v: stats.totalUsers, c: '#AAB4C0' },
          ].map(s => (
            <div key={s.l} className="card-glass" style={{ borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ color: '#AAB4C0', fontSize: '0.78rem', marginTop: '0.25rem' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card-glass" style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,229,255,0.1)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>All Orders</span>
            <span style={{ color: '#AAB4C0', fontSize: '0.85rem' }}>{orders?.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(170,180,192,0.1)' }}>
                  {['Student','Topic','Type','Pages','Deadline','Price','Status','Action'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#AAB4C0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders?.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(170,180,192,0.06)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>{(o.profiles as { full_name: string })?.full_name || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#AAB4C0', fontSize: '0.8rem' }}>{o.paper_type}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#AAB4C0', fontSize: '0.8rem' }}>{o.pages}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#AAB4C0', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(o.deadline).toLocaleDateString()}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#00E5FF', fontWeight: 600, fontSize: '0.85rem' }}>${o.price}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status], border: `1px solid ${statusColors[o.status]}40`, borderRadius: 100, padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{o.status.replace('_',' ')}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <AdminStatusForm orderId={o.id} currentStatus={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="card-glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,229,255,0.1)', fontWeight: 700 }}>All Users</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(170,180,192,0.1)' }}>
                  {['Name','Email','Role','Joined'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', color: '#AAB4C0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users?.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(170,180,192,0.06)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>{u.full_name || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#AAB4C0', fontSize: '0.82rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ background: u.role==='admin' ? 'rgba(0,229,255,0.15)' : 'rgba(170,180,192,0.1)', color: u.role==='admin' ? '#00E5FF' : '#AAB4C0', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem', fontWeight: 600 }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: '#AAB4C0', fontSize: '0.82rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const statuses = ['pending','assigned','in_progress','review','completed','cancelled']
  return (
    <form action={`/api/admin/orders/${orderId}`} method="POST">
      <select name="status" defaultValue={currentStatus} style={{ background: '#0d1a2d', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '0.35rem', padding: '0.3rem 0.5rem', color: '#F0F4F8', fontSize: '0.78rem', cursor: 'pointer' }}
        onChange={e => { const f = e.target.form; if(f) f.submit() }}>
        {statuses.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
      </select>
    </form>
  )
}
