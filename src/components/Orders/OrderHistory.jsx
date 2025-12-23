export default function OrderHistory({ orders }) {
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

  if (orders.length === 0) {
    return (
      <div className="relative p-12 bg-white rounded-lg shadow-lg border-2 border-gray-300 text-center">
        <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
        <div className="relative z-10">
          <p className="font-mono text-xl text-gray-600">
            No orders yet. Create your first order to get started!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-2xl font-bold text-gray-900">
        Order History
      </h2>
      <div className="space-y-4">
        {orders.map((order) => (
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

              {order.shipped_at && (
                <p className="font-mono text-sm text-gray-600">
                  Shipped: {new Date(order.shipped_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

