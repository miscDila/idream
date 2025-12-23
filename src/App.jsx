import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/Auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import About from './pages/About'
import LoginForm from './components/Auth/LoginForm'
import Dashboard from './pages/Dashboard'
import Purchase from './pages/Purchase'
import PurchaseSuccess from './pages/PurchaseSuccess'
import GiftRedeem from './pages/GiftRedeem'
import NotionConnect from './pages/NotionConnect'
import NotionCallback from './pages/NotionCallback'
import NotionVisionBoard from './pages/NotionVisionBoard'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import GroupJoin from './pages/GroupJoin'
import OrderStickers from './pages/OrderStickers'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminOrders from './pages/Admin/Orders'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase"
            element={<Purchase />}
          />
          <Route path="/purchase-success" element={<PurchaseSuccess />} />
          <Route path="/gift-redeem" element={<GiftRedeem />} />
          <Route
            path="/dashboard/notion"
            element={
              <ProtectedRoute>
                <NotionConnect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notion/vision-board"
            element={
              <ProtectedRoute>
                <NotionVisionBoard />
              </ProtectedRoute>
            }
          />
          <Route path="/notion/callback" element={<NotionCallback />} />
          <Route
            path="/dashboard/groups"
            element={<Groups />}
          />
          <Route
            path="/dashboard/groups/:id"
            element={<GroupDetail />}
          />
          <Route
            path="/dashboard/groups/join"
            element={<GroupJoin />}
          />
          <Route
            path="/dashboard/orders"
            element={<OrderStickers />}
          />
          <Route
            path="/dashboard/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App


