export default function InviteMembers({ group, onClose }) {
  const inviteUrl = `${window.location.origin}/dashboard/groups/join?code=${group.invite_code}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl)
    alert('Invite link copied to clipboard!')
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
            Invite Members
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Invite Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={group.invite_code}
                  readOnly
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="font-mono text-sm text-gray-600">
              Share this code or link with people you want to invite to the group.
            </p>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

