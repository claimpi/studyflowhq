import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [{ data: orders }, { data: users }] = await Promise.all([
    supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ])

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    active: orders?.filter(o => ['assigned','in_progress'].includes(o.status)).length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0,
    revenue: orders?.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.price || 0), 0) || 0,
    unpaid: orders?.filter(o => o.payment_status !== 'paid').length || 0,
    users: users?.length || 0,
  }

  return <AdminClient orders={orders || []} users={users || []} stats={stats} />
}
