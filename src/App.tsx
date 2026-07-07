import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { OperationsPage } from './pages/OperationsPage'
import { DashboardPageWrapper } from './pages/DashboardPageWrapper'
import { AuthPage } from './pages/AuthPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<OperationsPage />} />
            <Route path="dashboard" element={<DashboardPageWrapper />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', border: '1px solid #f3f4f6' },
        }} />
      </AuthProvider>
    </BrowserRouter>
  )
}
