export default function PurchaseTypeSelector({ isGift, onChange }) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-6 py-4 rounded-lg border-2 font-mono text-lg transition-all ${
          !isGift
            ? 'bg-amber-500 text-white border-amber-600 shadow-lg'
            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
        }`}
      >
        For Me
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-6 py-4 rounded-lg border-2 font-mono text-lg transition-all ${
          isGift
            ? 'bg-amber-500 text-white border-amber-600 shadow-lg'
            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
        }`}
      >
        As Gift
      </button>
    </div>
  )
}

