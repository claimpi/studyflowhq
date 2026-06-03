import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const STATUS: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: '#ffd60a', bg: 'rgba(255,214,10,0.12)',  label: 'Pending' },
  assigned:    { color: '#00E5FF', bg: 'rgba(0,229,255,0.12)',   label: 'Assigned' },
  in_progress: { color: '#00ff87', bg: 'rgba(0,255,135,0.12)',   label: 'In Progress' },
  review:      { color: '#ffa500', bg: 'rgba(255,165,0,0.12)',   label: 'Under Review' },
  completed:   { color: '#00ff87', bg: 'rgba(0,255,135,0.15)',   label: 'Completed' },
  cancelled:   { color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)', label: 'Cancelled' },
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  // Admins see all orders, students see only theirs
  const ordersQuery = isAdmin
    ? supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(5)
    : supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const { data: orders } = await ordersQuery

  const stats = {
    total: orders?.length || 0,
    active: orders?.filter(o => ['pending','assigned','in_progress'].includes(o.status)).length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0,
    spent: orders?.filter(o => o.status === 'completed').reduce((s, o) => s + (o.price || 0), 0).toFixed(2) || '0.00',
  }

  const F: React.CSSProperties = { fontFamily: 'Outfit, sans-serif' }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#080f1e', ...F }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* ── ADMIN BANNER ── */}
          {isAdmin && (
            <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,255,135,0.05))', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #00E5FF, #00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚡</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#eef2f7', fontSize: '0.95rem' }}>You are signed in as Admin</div>
                  <div style={{ color: '#8892a4', fontSize: '0.8rem' }}>Access the full admin portal to manage all orders, users and deliveries</div>
                </div>
              </div>
              <Link href="/admin" style={{ background: 'linear-gradient(135deg, #00E5FF, #00b8cc)', color: '#080f1e', padding: '0.65rem 1.5rem', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Open Admin Dashboard →
              </Link>
            </div>
          )}

          {/* ── HEADER ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem', color: '#eef2f7' }}>
                Welcome back, <span style={{ background: 'linear-gradient(135deg,#00E5FF,#00ff87)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {profile?.full_name?.split(' ')[0] || 'Student'}
                </span>
              </h1>
              <p style={{ color: '#8892a4', fontSize: '0.88rem' }}>
                {isAdmin ? 'Admin account · ' : ''}{profile?.email}
              </p>
            </div>
            <Link href="/order" style={{ background: 'linear-gradient(135deg,#00E5FF,#00b8cc)', color: '#080f1e', padding: '0.65rem 1.4rem', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              + New Order
            </Link>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Orders', value: stats.total, color: '#8892a4', icon: '📋' },
              { label: 'Active', value: stats.active, color: '#00E5FF', icon: '⚡' },
              { label: 'Completed', value: stats.completed, color: '#00ff87', icon: '✅' },
              { label: 'Total Spent', value: `$${stats.spent}`, color: '#ffd60a', icon: '💰' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#8892a4', fontSize: '0.75rem', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── ORDERS TABLE ── */}
          <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(0,229,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#eef2f7' }}>
                {isAdmin ? 'Recent Orders (All Students)' : 'My Orders'}
              </span>
              {isAdmin && (
                <Link href="/admin" style={{ fontSize: '0.8rem', color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
                  View all in Admin →
                </Link>
              )}
            </div>

            {!orders?.length ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <div style={{ color: '#8892a4', marginBottom: '1rem' }}>No orders yet</div>
                <Link href="/order" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                  Place your first order →
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,229,255,0.07)' }}>
                      {[
                        ...(isAdmin ? ['Student'] : []),
                        'Topic', 'Type', 'Pages', 'Deadline', 'Price', 'Status'
                      ].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', color: '#8892a4', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const sc = STATUS[o.status] || STATUS.pending
                      return (
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
                          {isAdmin && (
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#eef2f7' }}>{(o.profiles as {full_name:string})?.full_name || '—'}</div>
                              <div style={{ fontSize: '0.72rem', color: '#8892a4' }}>{(o.profiles as {email:string})?.email}</div>
                            </td>
                          )}
                          <td style={{ padding: '1rem 1.25rem', maxWidth: 200 }}>
                            <div style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#eef2f7' }}>{o.title}</div>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#8892a4', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{o.paper_type}</td>
                          <td style={{ padding: '1rem 1.25rem', color: '#8892a4', fontSize: '0.82rem' }}>{o.pages}</td>
                          <td style={{ padding: '1rem 1.25rem', color: '#8892a4', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{new Date(o.deadline).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem 1.25rem', color: '#00E5FF', fontWeight: 700, fontSize: '0.88rem' }}>${o.price}</td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ background: sc.bg, color: sc.color, borderRadius: 100, padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── ADMIN QUICK LINKS ── */}
          {isAdmin && (
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { href: '/admin', icon: '📋', label: 'Manage All Orders', desc: 'View, assign & update status' },
                { href: '/order', icon: '✦', label: 'Place Test Order', desc: 'Test the student flow' },
                { href: '/admin#users', icon: '👥', label: 'Manage Users', desc: 'View all registered students' },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.1)')}>
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#00E5FF', fontSize: '0.85rem' }}>{item.label}</div>
                    <div style={{ color: '#8892a4', fontSize: '0.75rem' }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
