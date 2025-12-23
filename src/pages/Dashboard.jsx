import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    groups: 0,
    wins: 0,
    orders: 0,
  })

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }

    fetchStats()
  }, [userProfile, navigate])

  const fetchStats = async () => {
    if (!user?.id) return

    try {
      // Get group count
      const { count: groupCount } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get wins count
      const { count: winsCount } = await supabase
        .from('wins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get orders count
      const { count: ordersCount } = await supabase
        .from('sticker_orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setStats({
        groups: groupCount || 0,
        wins: winsCount || 0,
        orders: ordersCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!userProfile?.has_golden_ticket) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="font-mono text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="font-mono text-xl text-gray-700">
            Welcome back, {userProfile?.full_name || user?.email}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Golden Ticket
              </h3>
              <p className="font-mono text-2xl text-green-600">✓ Active</p>
            </div>
          </div>

          <Link
            to="/dashboard/notion"
            className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300 hover:border-amber-400 transition-colors"
          >
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Notion Connection
              </h3>
              <p className="font-mono text-xl text-gray-700">
                Connect →
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard/groups"
            className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300 hover:border-amber-400 transition-colors"
          >
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Groups
              </h3>
              <p className="font-mono text-2xl text-gray-700">{stats.groups}</p>
            </div>
          </Link>

          <Link
            to="/dashboard/orders"
            className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300 hover:border-amber-400 transition-colors"
          >
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Sticker Orders
              </h3>
              <p className="font-mono text-2xl text-gray-700">{stats.orders}</p>
            </div>
          </Link>
        </div>

        <div className="relative p-8 bg-white rounded-lg shadow-lg border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          <div className="relative z-10">
            <h2 className="font-mono text-2xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/dashboard/notion"
                className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-lg rounded-lg text-center transition-colors"
              >
                Connect Notion
              </Link>
              <Link
                to="/dashboard/groups"
                className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-mono text-lg rounded-lg text-center transition-colors"
              >
                Join a Group
              </Link>
              <Link
                to="/dashboard/orders"
                className="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-mono text-lg rounded-lg text-center transition-colors"
              >
                Order Stickers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

