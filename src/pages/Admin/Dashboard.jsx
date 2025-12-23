import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AdminRoute } from '../../components/Auth/ProtectedRoute'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    goldenTickets: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Get golden tickets
      const { count: ticketCount } = await supabase
        .from('golden_tickets')
        .select('*', { count: 'exact', head: true })

      // Get pending orders
      const { count: orderCount } = await supabase
        .from('sticker_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Calculate revenue (150 * number of tickets)
      const revenue = (ticketCount || 0) * 150

      setStats({
        totalUsers: userCount || 0,
        goldenTickets: ticketCount || 0,
        pendingOrders: orderCount || 0,
        totalRevenue: revenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="font-mono text-xl text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="font-mono text-xl text-gray-700">
            Overview of your platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Total Users
              </h3>
              <p className="font-mono text-3xl text-gray-700">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Golden Tickets
              </h3>
              <p className="font-mono text-3xl text-gray-700">{stats.goldenTickets}</p>
            </div>
          </div>

          <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Pending Orders
              </h3>
              <p className="font-mono text-3xl text-amber-600">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
            <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-mono text-lg font-bold text-gray-900 mb-2">
                Total Revenue
              </h3>
              <p className="font-mono text-3xl text-green-600">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-8 bg-white rounded-lg shadow-lg border-2 border-gray-300">
          <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
          <div className="relative z-10">
            <h2 className="font-mono text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/dashboard/admin/orders"
                className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-mono text-lg rounded-lg text-center transition-colors"
              >
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  )
}

