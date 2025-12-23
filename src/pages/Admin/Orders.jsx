import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AdminRoute } from '../../components/Auth/ProtectedRoute'
import { supabase } from '../../lib/supabase'
import MarkShipped from '../../components/Admin/MarkShipped'

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('sticker_orders')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .order('requested_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            Order Management
          </h1>
          <p className="font-mono text-xl text-gray-700">
            Manage sticker orders and shipping
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'shipped', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-mono rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="relative p-12 bg-white rounded-lg shadow-lg border-2 border-gray-300 text-center">
              <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
              <div className="relative z-10">
                <p className="font-mono text-xl text-gray-600">
                  No orders found
                </p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300"
              >
                <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-mono text-xl font-bold text-gray-900 mb-2">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="font-mono text-sm text-gray-600">
                        Customer: {order.user?.full_name || order.user?.email}
                      </p>
                      <p className="font-mono text-sm text-gray-600">
                        Requested: {new Date(order.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded font-mono text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="font-mono text-sm font-medium text-gray-700 mb-1">
                      Shipping Address:
                    </p>
                    <p className="font-mono text-sm text-gray-600">
                      {order.shipping_address.name}<br />
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                      {order.shipping_address.country && `, ${order.shipping_address.country}`}
                    </p>
                  </div>

                  {order.tracking_number && (
                    <div className="mb-4">
                      <p className="font-mono text-sm font-medium text-gray-700 mb-1">
                        Tracking Number:
                      </p>
                      <p className="font-mono text-sm text-gray-600">
                        {order.tracking_number}
                      </p>
                    </div>
                  )}

                  {order.status !== 'shipped' && order.status !== 'completed' && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
                    >
                      Mark as Shipped
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && (
          <MarkShipped
            order={selectedOrder}
            onClose={() => {
              setSelectedOrder(null)
              fetchOrders()
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default function AdminOrders() {
  return (
    <AdminRoute>
      <AdminOrdersPage />
    </AdminRoute>
  )
}

