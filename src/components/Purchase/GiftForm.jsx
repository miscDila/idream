export default function GiftForm({ recipient, onChange }) {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="font-mono text-2xl font-bold text-gray-900">
        Gift Recipient Information
      </h3>
      <div>
        <label htmlFor="recipientName" className="block font-mono text-sm font-medium text-gray-700 mb-2">
          Recipient Name
        </label>
        <input
          id="recipientName"
          type="text"
          required
          value={recipient.name || ''}
          onChange={(e) => onChange({ ...recipient, name: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="recipientEmail" className="block font-mono text-sm font-medium text-gray-700 mb-2">
          Recipient Email
        </label>
        <input
          id="recipientEmail"
          type="email"
          required
          value={recipient.email || ''}
          onChange={(e) => onChange({ ...recipient, email: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
          placeholder="recipient@example.com"
        />
        <p className="mt-2 font-mono text-sm text-gray-600">
          We'll send them an email with instructions to redeem their Golden Ticket.
        </p>
      </div>
    </div>
  )
}

