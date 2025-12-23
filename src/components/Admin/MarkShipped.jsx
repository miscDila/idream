import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MarkShipped({ order, onClose }) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('sticker_orders')
        .update({
          status: 'shipped',
          shipped_at: new Date().toISOString(),
          tracking_number: trackingNumber || null,
        })
        .eq('id', order.id)

      if (updateError) throw updateError

      // TODO: Send email notification to user
      // You can use Resend, SendGrid, or Supabase Edge Function for this

      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update order')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl border-2 border-gray-300 max-w-lg w-full">
        <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
        
        <div className="relative z-10 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>

          <h2 className="font-mono text-3xl font-bold text-gray-900 mb-6">
            Mark as Shipped
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Tracking Number (optional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                placeholder="1Z999AA10123456784"
              />
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
                {loading ? 'Updating...' : 'Mark as Shipped'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

