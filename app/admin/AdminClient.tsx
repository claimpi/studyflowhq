'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: '#ffd60a', bg: 'rgba(255,214,10,0.1)',  label: 'Pending' },
  assigned:    { color: '#00E5FF', bg: 'rgba(0,229,255,0.1)',   label: 'Assigned' },
  in_progress: { color: '#00ff87', bg: 'rgba(0,255,135,0.1)',   label: 'In Progress' },
  review:      { color: '#ffa500', bg: 'rgba(255,165,0,0.1)',   label: 'Under Review' },
  completed:   { color: '#00ff87', bg: 'rgba(0,255,135,0.15)',  label: 'Completed' },
  cancelled:   { color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)', label: 'Cancelled' },
}

type Order = {
  id: string; title: string; paper_type: string; subject: string
  academic_level: string; pages: number; deadline: string
  price: number; status: string; payment_status: string
  created_at: string; instructions?: string
  completed_file_url?: string; completed_file_name?: string
  profiles: { full_name: string; email: string } | null
}
type User = { id: string; email: string; full_name: string; role: string; created_at: string }

export default function AdminClient({ orders, users, stats }: { orders: Order[]; users: User[]; stats: Record<string, number> }) {
  const [tab, setTab] = useState<'orders'|'users'>('orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState('')
  const [uploadingId, setUploadingId] = useState('')
  const [toast, setToast] = useState({ msg: '', type: 'success' })
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [localOrders, setLocalOrders] = useState(orders)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingUploadOrderId, setPendingUploadOrderId] = useState('')

  const filtered = localOrders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.profiles?.email?.toLowerCase().includes(q) || o.profiles?.full_name?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  function showToast(msg: string, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000)
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null)
        showToast(`✅ Status updated → "${status}" · Client notified by email`)
      }
    } finally { setUpdatingId('') }
  }

  function triggerUpload(orderId: string) {
    setPendingUploadOrderId(orderId)
    fileInputRef.current?.click()
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !pendingUploadOrderId) return
    e.target.value = ''

    setUploadingId(pendingUploadOrderId)
    showToast('⏳ Uploading paper...')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('orderId', pendingUploadOrderId)

      const res = await fetch('/api/upload-paper', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.success) {
        setLocalOrders(prev => prev.map(o =>
          o.id === pendingUploadOrderId
            ? { ...o, status: 'completed', completed_file_url: data.url, completed_file_name: data.fileName }
            : o
        ))
        if (selectedOrder?.id === pendingUploadOrderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: 'completed', completed_file_url: data.url, completed_file_name: data.fileName } : null)
        }
        showToast(`🎉 "${file.name}" uploaded! Student emailed automatically.`)
      } else {
        showToast(`❌ Upload failed: ${data.error}`, 'error')
      }
    } catch (err) {
      showToast(`❌ Upload error: ${String(err)}`, 'error')
    } finally {
      setUploadingId('')
      setPendingUploadOrderId('')
    }
  }

  const inp: React.CSSProperties = { background: 'rgba(8,15,30,0.8)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, padding: '0.5rem 0.9rem', color: '#eef2f7', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#080f1e', fontFamily: 'Outfit, sans-serif' }}>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.zip" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Navbar */}
      <nav style={{ background: 'rgba(14,26,46,0.98)', borderBottom: '1px solid rgba(0,229,255,0.12)', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#00E5FF,#00ff87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', color: '#080f1e' }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#eef2f7' }}>StudyFlowHQ <span style={{ color: '#00E5FF', fontSize: '0.72rem', fontWeight: 600 }}>ADMIN</span></span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.82rem' }}>← My Dashboard</Link>
          <Link href="/" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.82rem' }}>← Site</Link>
        </div>
      </nav>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', background: '#0e1a2e', border: `1px solid ${toast.type === 'error' ? 'rgba(255,77,109,0.4)' : 'rgba(0,255,135,0.3)'}`, borderRadius: 10, padding: '0.75rem 1.5rem', color: toast.type === 'error' ? '#ff4d6d' : '#00ff87', fontSize: '0.88rem', fontWeight: 600, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { l: 'Total Orders', v: stats.total, c: '#8892a4', i: '📋' },
            { l: 'Pending', v: stats.pending, c: '#ffd60a', i: '⏳' },
            { l: 'Active', v: stats.active, c: '#00E5FF', i: '⚡' },
            { l: 'Completed', v: stats.completed, c: '#00ff87', i: '✅' },
            { l: 'Unpaid', v: stats.unpaid, c: '#ff4d6d', i: '💳' },
            { l: 'Revenue', v: `$${(stats.revenue || 0).toFixed(0)}`, c: '#00ff87', i: '💰' },
            { l: 'Users', v: stats.users, c: '#8892a4', i: '👥' },
          ].map(s => (
            <div key={s.l} style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{s.i}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ color: '#8892a4', fontSize: '0.68rem', marginTop: '0.15rem' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['orders','users'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '0.55rem 1.4rem', borderRadius: 8, border: tab === t ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(0,229,255,0.1)', background: tab === t ? 'rgba(0,229,255,0.1)' : 'transparent', color: tab === t ? '#00E5FF' : '#8892a4', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize' }}>
              {t === 'orders' ? `📋 Orders (${localOrders.length})` : `👥 Users (${users.length})`}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
            {/* Orders list */}
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, name or email..." style={{ ...inp, flex: 1, minWidth: 200 }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inp}>
                  <option value="all">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,229,255,0.08)', fontWeight: 700, fontSize: '0.9rem' }}>
                  {filtered.length} orders
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                        {['Client','Title','Pages','Deadline','Price','Status','Payment','Upload Paper'].map(h => (
                          <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#8892a4', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(o => {
                        const sc = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending
                        const isUploading = uploadingId === o.id
                        return (
                          <tr key={o.id} onClick={() => setSelectedOrder(o)} style={{ borderBottom: '1px solid rgba(0,229,255,0.05)', cursor: 'pointer', background: selectedOrder?.id === o.id ? 'rgba(0,229,255,0.03)' : 'transparent' }}>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{o.profiles?.full_name || 'Guest'}</div>
                              <div style={{ fontSize: '0.68rem', color: '#8892a4' }}>{o.profiles?.email}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', maxWidth: 160 }}>
                              <div style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</div>
                              <div style={{ fontSize: '0.68rem', color: '#8892a4' }}>{o.paper_type}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#8892a4' }}>{o.pages}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#8892a4', whiteSpace: 'nowrap' }}>{new Date(o.deadline).toLocaleDateString()}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#00E5FF', fontWeight: 700, fontSize: '0.85rem' }}>${o.price}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <select value={o.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(o.id, e.target.value)} disabled={updatingId === o.id} style={{ ...inp, fontSize: '0.72rem', padding: '0.3rem 0.5rem', cursor: 'pointer' }}>
                                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                              </select>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ color: o.payment_status === 'paid' ? '#00ff87' : '#ffd60a', fontSize: '0.75rem', fontWeight: 700 }}>
                                {o.payment_status === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                              {o.completed_file_url ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ color: '#00ff87', fontSize: '0.72rem', fontWeight: 700 }}>✅ Delivered</span>
                                  <button onClick={() => triggerUpload(o.id)} style={{ background: 'transparent', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF', borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                                    Replace
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => triggerUpload(o.id)}
                                  disabled={isUploading}
                                  style={{ background: isUploading ? 'rgba(0,229,255,0.05)' : 'rgba(0,255,135,0.1)', border: `1px solid ${isUploading ? 'rgba(0,229,255,0.2)' : 'rgba(0,255,135,0.3)'}`, color: isUploading ? '#8892a4' : '#00ff87', borderRadius: 8, padding: '0.45rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  {isUploading ? (
                                    <><span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid rgba(0,229,255,0.3)', borderTopColor: '#00E5FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Uploading...</>
                                  ) : (
                                    <>📤 Upload Paper</>
                                  )}
                                </button>
                              )}
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
              <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 14, padding: '1.5rem', height: 'fit-content', position: 'sticky', top: 68 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Order Details</span>
                  <button onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,77,109,0.1)', border: 'none', color: '#ff4d6d', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>

                {/* Paper delivery status */}
                <div style={{ background: selectedOrder.completed_file_url ? 'rgba(0,255,135,0.06)' : 'rgba(255,214,10,0.05)', border: `1px solid ${selectedOrder.completed_file_url ? 'rgba(0,255,135,0.2)' : 'rgba(255,214,10,0.15)'}`, borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
                  {selectedOrder.completed_file_url ? (
                    <>
                      <div style={{ fontWeight: 700, color: '#00ff87', fontSize: '0.85rem', marginBottom: '0.4rem' }}>✅ Paper Delivered</div>
                      <div style={{ color: '#8892a4', fontSize: '0.78rem', marginBottom: '0.75rem' }}>📄 {selectedOrder.completed_file_name}</div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a href={selectedOrder.completed_file_url} target="_blank" rel="noreferrer" style={{ flex: 1, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)', color: '#00ff87', padding: '0.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem', textAlign: 'center' }}>
                          Preview ↗
                        </a>
                        <button onClick={() => triggerUpload(selectedOrder.id)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF', padding: '0.5rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Outfit, sans-serif' }}>
                          Replace File
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 700, color: '#ffd60a', fontSize: '0.85rem', marginBottom: '0.4rem' }}>⏳ Paper Not Yet Uploaded</div>
                      <div style={{ color: '#8892a4', fontSize: '0.78rem', marginBottom: '0.75rem' }}>Upload the completed paper to deliver it to the student</div>
                      <button
                        onClick={() => triggerUpload(selectedOrder.id)}
                        disabled={uploadingId === selectedOrder.id}
                        style={{ width: '100%', background: 'linear-gradient(135deg,#00ff87,#00cc6a)', color: '#080f1e', border: 'none', padding: '0.75rem', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', opacity: uploadingId === selectedOrder.id ? 0.7 : 1 }}>
                        {uploadingId === selectedOrder.id ? '⏳ Uploading...' : '📤 Upload Completed Paper'}
                      </button>
                      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#8892a4' }}>
                        PDF, DOCX or ZIP · Student emailed automatically
                      </div>
                    </>
                  )}
                </div>

                {/* Order details */}
                <div style={{ display: 'grid', gap: '0', marginBottom: '1.25rem' }}>
                  {[
                    ['Order ID', selectedOrder.id.substring(0,8).toUpperCase()],
                    ['Client', selectedOrder.profiles?.full_name || 'Guest'],
                    ['Email', selectedOrder.profiles?.email || '—'],
                    ['Type', selectedOrder.paper_type],
                    ['Subject', selectedOrder.subject],
                    ['Level', selectedOrder.academic_level],
                    ['Pages', `${selectedOrder.pages} (${selectedOrder.pages * 275} words)`],
                    ['Deadline', new Date(selectedOrder.deadline).toLocaleString()],
                    ['Price', `$${selectedOrder.price}`],
                    ['Payment', selectedOrder.payment_status],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
                      <span style={{ color: '#8892a4', fontSize: '0.75rem' }}>{l}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.78rem', maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all', color: '#eef2f7' }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Title */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#8892a4', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Title</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4, color: '#eef2f7' }}>{selectedOrder.title}</div>
                </div>

                {/* Instructions */}
                {selectedOrder.instructions && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ color: '#8892a4', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Instructions</div>
                    <div style={{ fontSize: '0.78rem', color: '#c4cdd8', lineHeight: 1.5, background: 'rgba(0,229,255,0.03)', borderRadius: 8, padding: '0.75rem', maxHeight: 100, overflow: 'auto' }}>{selectedOrder.instructions}</div>
                  </div>
                )}

                {/* Status update */}
                <div>
                  <div style={{ color: '#8892a4', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Update Status</div>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <button key={k} onClick={() => updateStatus(selectedOrder.id, k)} disabled={selectedOrder.status === k || updatingId === selectedOrder.id}
                        style={{ padding: '0.55rem 1rem', borderRadius: 8, border: `1px solid ${selectedOrder.status === k ? v.color : 'rgba(0,229,255,0.1)'}`, background: selectedOrder.status === k ? v.bg : 'transparent', color: selectedOrder.status === k ? v.color : '#8892a4', fontSize: '0.78rem', fontWeight: 700, cursor: selectedOrder.status === k ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{v.label}</span>
                        {selectedOrder.status === k && <span style={{ fontSize: '0.62rem' }}>● CURRENT</span>}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.68rem', color: '#8892a4', textAlign: 'center', padding: '0.4rem', background: 'rgba(0,229,255,0.03)', borderRadius: 6 }}>
                    📧 Client emailed automatically on every status change
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div style={{ background: '#0e1a2e', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,229,255,0.08)', fontWeight: 700 }}>Users ({users.length})</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                    {['Name','Email','Role','Joined'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', color: '#8892a4', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>{u.full_name || '—'}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#8892a4', fontSize: '0.82rem' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{ background: u.role==='admin'?'rgba(0,229,255,0.1)':'rgba(170,180,192,0.08)', color: u.role==='admin'?'#00E5FF':'#8892a4', borderRadius: 100, padding: '0.15rem 0.65rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{u.role}</span>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
