import DashboardLayout from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'
import VisionBoardView from '../components/Notion/VisionBoardView'

function NotionVisionBoardPage() {
  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="font-mono text-4xl font-bold text-gray-900 mb-2">
            Vision Board
          </h1>
          <p className="font-mono text-xl text-gray-700">
            Your goals synced from Notion
          </p>
        </div>

        <VisionBoardView />
      </div>
    </DashboardLayout>
  )
}

export default function NotionVisionBoard() {
  return (
    <ProtectedRoute>
      <NotionVisionBoardPage />
    </ProtectedRoute>
  )
}

