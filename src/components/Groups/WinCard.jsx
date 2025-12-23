export default function WinCard({ win }) {
  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300">
      <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-mono text-xl font-bold text-gray-900 mb-2">
              {win.title}
            </h3>
            {win.user && (
              <p className="font-mono text-sm text-gray-600">
                by {win.user.full_name || win.user.email}
              </p>
            )}
          </div>
          <span className="font-mono text-xs text-gray-500">
            {new Date(win.created_at).toLocaleDateString()}
          </span>
        </div>

        {win.description && (
          <p className="font-mono text-sm text-gray-700 mb-4">
            {win.description}
          </p>
        )}

        {win.image_url && (
          <img
            src={win.image_url}
            alt={win.title}
            className="w-full rounded-lg mb-4"
          />
        )}
      </div>
    </div>
  )
}

