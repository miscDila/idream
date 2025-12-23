import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import ShippingForm from '../components/Orders/ShippingForm'
import OrderHistory from '../components/Orders/OrderHistory'

function OrderStickersPage() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userProfile?.has_golden_ticket) {
      navigate('/purchase')
      return
    }
    fetchOrders()
  }, [user, userProfile, navigate])

  const fetchOrders = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('sticker_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
              Sticker Orders
            </h1>
            <p className="font-mono text-xl text-gray-700">
              Request physical stickers for your vision board
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
          >
            New Order
          </button>
        </div>

        {showForm && (
          <ShippingForm
            onClose={() => {
              setShowForm(false)
              fetchOrders()
            }}
          />
        )}

        <OrderHistory orders={orders} />
      </div>
    </DashboardLayout>
  )
}

export default function OrderStickers() {
  return (
    <ProtectedRoute>
      <OrderStickersPage />
    </ProtectedRoute>
  )
}

