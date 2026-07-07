import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { OperationsPage } from './pages/OperationsPage'
import { DashboardPageWrapper } from './pages/DashboardPageWrapper'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OperationsPage />} />
          <Route path="dashboard" element={<DashboardPageWrapper />} />
        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', border: '1px solid #f3f4f6' },
      }} />
    </BrowserRouter>
  )
}
