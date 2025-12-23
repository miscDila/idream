import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardLayout({ children }) {
  const { userProfile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/dashboard/notion', label: 'Notion' },
    { path: '/dashboard/groups', label: 'Groups' },
    { path: '/dashboard/orders', label: 'Sticker Orders' },
  ]

  if (userProfile?.is_admin) {
    navItems.push({ path: '/dashboard/admin', label: 'Admin' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center font-mono text-2xl font-bold text-gray-900">
                iDream
              </Link>
              <div className="ml-10 flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 font-mono text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-mono text-sm text-gray-700">
                {userProfile?.full_name || userProfile?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono text-sm rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

