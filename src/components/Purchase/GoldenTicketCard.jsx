export default function GoldenTicketCard() {
  return (
    <div className="relative p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-400 transform rotate-1">
      <div className="absolute inset-0 grid-paper-section opacity-10 rounded-lg"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-amber-200 border-2 border-amber-400 rounded-lg mb-4">
            <span className="font-mono text-sm font-bold text-amber-900">LIFETIME ACCESS</span>
          </div>
          <h2 className="font-mono text-5xl font-bold text-gray-900 mb-2">
            Golden Ticket
          </h2>
          <p className="font-mono text-2xl text-gray-700 mb-4">
            $150
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">✓</span>
            <p className="font-mono text-lg text-gray-800">
              Virtual vision board planning and tracking (Notion integration)
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">✓</span>
            <p className="font-mono text-lg text-gray-800">
              Community creation (groups) and win sharing
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">✓</span>
            <p className="font-mono text-lg text-gray-800">
              Physical vision board with stickers mailed as goals change or get achieved
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">✓</span>
            <p className="font-mono text-lg text-gray-800">
              Lifetime access - the best gift you can give anyone
            </p>
          </div>
        </div>

        <p className="font-mono text-center text-sm text-gray-600 italic">
          "The gift of helping them reach and track their goals for life"
        </p>
      </div>
    </div>
  )
}

