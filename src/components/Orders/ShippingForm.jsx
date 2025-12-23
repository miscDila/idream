import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function ShippingForm({ onClose }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const shippingAddress = {
        name: formData.name,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      }

      const { error: orderError } = await supabase
        .from('sticker_orders')
        .insert({
          user_id: user.id,
          shipping_address: shippingAddress,
          status: 'pending',
        })

      if (orderError) throw orderError

      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create order')
      setLoading(false)
    }
  }

  return (
    <div className="relative p-8 bg-white rounded-lg shadow-lg border-2 border-gray-300 mb-8">
      <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
      
      <div className="relative z-10">
        <h2 className="font-mono text-2xl font-bold text-gray-900 mb-6">
          Shipping Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                State/Province *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
              <p className="font-mono text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

