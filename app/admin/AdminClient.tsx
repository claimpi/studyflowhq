'use client'
import { useState } from 'react'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: '#ffd60a', bg: 'rgba(255,214,10,0.1)',  label: 'Pending' },
  assigned:    { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)',   label: 'Assigned' },
  in_progress: { color: '#00ff87', bg: 'rgba(0,255,135,0.1)',   label: 'In Progress' },
  review:      { color: '#ffa500', bg: 'rgba(255,165,0,0.1)',   label: 'Under Review' },
  completed:   { color: '#00ff87', bg: 'rgba(0,255,135,0.15)',  label: 'Completed' },
  cancelled:   { color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)', label: 'Cancelled' },
}

const PAYMENT_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: '#ffd60a', label: 'Unpaid' },
  paid:    { color: '#00ff87', label: 'Paid' },
  failed:  { color: '#ff4d6d', label: 'Failed' },
}

type Order = {
  id: string; title: string; paper_type: string; subject: string
  academic_level: string; pages: number; deadline: string
  price: number; status: string; payment_status: string
  created_at: string; instructions?: string
  profiles: { full_name: string; email: string } | null
}
type User = { id: string; email: string; full_name: string; role: string; created_at: string }

export default function AdminClient({ orders, users, stats }: { orders: Order[]; users: User[]; stats: Record<string, number> }) {
  const [tab, setTab] = useState<'orders'|'users'>('orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState('')
  const [notifyMsg, setNotifyMsg] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = orders.filter(o => {
    const matchSearch = search === '' || o.title.toLowerCase().includes(search.toLowerCase()) || o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) || o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setNotifyMsg(`✅ Order updated to "${status}" — email sent to client`)
        if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status })
        setTimeout(() => setNotifyMsg(''), 4000)
        window.location.reload()
      }
    } finally { setUpdatingId('') }
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(8,15,30,0.8)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, padding: '0.5rem 0.9rem', color: '#eef2f7', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#080f1e', fontFamily: 'Outfit, sans-serif' }}>
      {/* Admin Nav */}
      <nav style={{ background: 'rgba(14,26,46,0.98)', borderBottom: '1px solid rgba(0,229,255,0.12)', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#00E5FF,#00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem', color: '#080f1e' }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#eef2f7' }}>StudyFlowHQ <span style={{ color: '#00E5FF', fontSize: '0.75rem', fontWeight: 600 }}>ADMIN</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.85rem' }}>← Portal</Link>
          <Link href="/" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.85rem' }}>← Site</Link>
        </div>
      </nav>

      {/* Toast */}
      {notifyMsg && (
        <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', background: '#0e1a2e', border: '1px solid rgba(0,255,135,0.3)', borderRadius: 10, padding: '0.75rem 1.5rem', color: '#00ff87', fontSize: '0.88rem', fontWeight: 600, zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {notifyMsg}
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Orders', value: stats.total, color: '#8892a4', icon: '📋' },
            { label: 'Pending', value: stats.pending, color: '#ffd60a', icon: '⏳' },
            { label: 'Active', value: stats.active, color: '#00E5FF', icon: '⚡' },
            { label: 'Completed', value: stats.completed, color: '#00ff87', icon: '✅' },
            { label: 'Unpaid', value: stats.unpaid, color: '#ff4d6d', icon: '💳' },
            { label: 'Revenue', value: `$${stats.revenue.toFixed(0)}`, color: '#00ff87', icon: '💰' },
            { label: 'Users', value: stats.users, color: '#8892a4', icon: '👥' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#8892a4', fontSize: '0.72rem', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['orders','users'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.6rem 1.5rem', borderRadius: 8, border: tab === t ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(0,229,255,0.1)', background: tab === t ? 'rgba(0,229,255,0.1)' : 'transparent', color: tab === t ? '#00E5FF' : '#8892a4', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize' }}>
              {t === 'orders' ? `📋 Orders (${orders.length})` : `👥 Users (${users.length})`}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
            {/* Orders list */}
            <div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, clients..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
                  <option value="all">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,229,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Orders ({filtered.length})</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                        {['Client','Title','Pages','Deadline','Price','Status','Payment','Action'].map(h => (
                          <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#8892a4', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(o => {
                        const sc = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending
                        const pc = PAYMENT_CONFIG[o.payment_status] || PAYMENT_CONFIG.pending
                        return (
                          <tr key={o.id} style={{ borderBottom: '1px solid rgba(0,229,255,0.05)', cursor: 'pointer', background: selectedOrder?.id === o.id ? 'rgba(0,229,255,0.04)' : 'transparent' }}
                            onClick={() => setSelectedOrder(o)}>
                            <td style={{ padding: '0.8rem 1rem' }}>
                              <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{o.profiles?.full_name || 'Guest'}</div>
                              <div style={{ fontSize: '0.72rem', color: '#8892a4' }}>{o.profiles?.email}</div>
                            </td>
                            <td style={{ padding: '0.8rem 1rem', maxWidth: 160 }}>
                              <div style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#8892a4' }}>{o.paper_type}</div>
                            </td>
                            <td style={{ padding: '0.8rem 1rem', fontSize: '0.82rem', color: '#8892a4' }}>{o.pages}</td>
                            <td style={{ padding: '0.8rem 1rem', fontSize: '0.78rem', color: '#8892a4', whiteSpace: 'nowrap' }}>{new Date(o.deadline).toLocaleDateString()}</td>
                            <td style={{ padding: '0.8rem 1rem', color: '#00E5FF', fontWeight: 700, fontSize: '0.88rem' }}>${o.price}</td>
                            <td style={{ padding: '0.8rem 1rem' }}>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 100, padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{sc.label}</span>
                            </td>
                            <td style={{ padding: '0.8rem 1rem' }}>
                              <span style={{ color: pc.color, fontSize: '0.75rem', fontWeight: 700 }}>{pc.label}</span>
                            </td>
                            <td style={{ padding: '0.8rem 1rem' }}>
                              <select
                                value={o.status}
                                onClick={e => e.stopPropagation()}
                                onChange={e => updateOrderStatus(o.id, e.target.value)}
                                disabled={updatingId === o.id}
                                style={{ ...inputStyle, fontSize: '0.75rem', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                              >
                                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                              </select>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#8892a4' }}>No orders found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 14, padding: '1.5rem', height: 'fit-content', position: 'sticky', top: 70 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 700 }}>Order Details</span>
                  <button onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,77,109,0.1)', border: 'none', color: '#ff4d6d', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Order ID', value: selectedOrder.id.substring(0, 8).toUpperCase() },
                    { label: 'Client', value: selectedOrder.profiles?.full_name || 'Guest' },
                    { label: 'Email', value: selectedOrder.profiles?.email || '—' },
                    { label: 'Paper Type', value: selectedOrder.paper_type },
                    { label: 'Subject', value: selectedOrder.subject },
                    { label: 'Level', value: selectedOrder.academic_level },
                    { label: 'Pages', value: `${selectedOrder.pages} (${selectedOrder.pages * 275} words)` },
                    { label: 'Deadline', value: new Date(selectedOrder.deadline).toLocaleString() },
                    { label: 'Price', value: `$${selectedOrder.price}` },
                    { label: 'Payment', value: PAYMENT_CONFIG[selectedOrder.payment_status]?.label || selectedOrder.payment_status },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
                      <span style={{ color: '#8892a4', fontSize: '0.78rem' }}>{item.label}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ color: '#8892a4', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Title</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4 }}>{selectedOrder.title}</div>
                </div>

                {selectedOrder.instructions && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ color: '#8892a4', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Instructions</div>
                    <div style={{ fontSize: '0.8rem', color: '#c4cdd8', lineHeight: 1.5, background: 'rgba(0,229,255,0.03)', borderRadius: 8, padding: '0.75rem', maxHeight: 120, overflow: 'auto' }}>{selectedOrder.instructions}</div>
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#8892a4', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Update Status</div>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <button key={k}
                        onClick={() => updateOrderStatus(selectedOrder.id, k)}
                        disabled={selectedOrder.status === k || updatingId === selectedOrder.id}
                        style={{ padding: '0.6rem', borderRadius: 8, border: `1px solid ${selectedOrder.status === k ? v.color : 'rgba(0,229,255,0.1)'}`, background: selectedOrder.status === k ? v.bg : 'transparent', color: selectedOrder.status === k ? v.color : '#8892a4', fontSize: '0.8rem', fontWeight: 700, cursor: selectedOrder.status === k ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{v.label}</span>
                        {selectedOrder.status === k && <span style={{ fontSize: '0.65rem' }}>● CURRENT</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#8892a4', textAlign: 'center', padding: '0.5rem', background: 'rgba(0,229,255,0.03)', borderRadius: 6 }}>
                  📧 Client is emailed automatically on every status change
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,229,255,0.08)', fontWeight: 700 }}>
              Users ({users.length})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                    {['Name','Email','Role','Joined'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', color: '#8892a4', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.88rem' }}>{u.full_name || '—'}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#8892a4', fontSize: '0.82rem' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{ background: u.role === 'admin' ? 'rgba(0,229,255,0.1)' : 'rgba(170,180,192,0.08)', color: u.role === 'admin' ? '#00E5FF' : '#8892a4', borderRadius: 100, padding: '0.15rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#8892a4', fontSize: '0.82rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
