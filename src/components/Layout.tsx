import { Outlet, useOutletContext, Navigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useWorkEntries } from '../hooks/useWorkEntries'
import { useTemplates } from '../hooks/useTemplates'
import { useStats } from '../hooks/useStats'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'
import type { WorkEntryDTO, TemplateDTO, CreateWorkEntryDTO, CreateTemplateDTO } from '../types/dto'

export interface AppContext {
  entries: WorkEntryDTO[]
  entriesLoading: boolean
  addEntry: (entry: CreateWorkEntryDTO) => Promise<boolean>
  deleteEntry: (id: string) => Promise<boolean>
  updateQuantity: (id: string, quantity: number) => Promise<boolean>
  templates: TemplateDTO[]
  templatesLoading: boolean
  addTemplate: (template: CreateTemplateDTO) => Promise<boolean>
  deleteTemplate: (id: string) => Promise<boolean>
  todayTotal: number
}

export const Layout = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sewing-50/30">
        <LoadingSpinner text="Se încarcă..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const { entries, loading: entriesLoading, addEntry, deleteEntry, updateQuantity } =
    useWorkEntries()
  const { templates, loading: templatesLoading, addTemplate, deleteTemplate } =
    useTemplates()
  const { todayTotal } = useStats(entries)

  const context: AppContext = {
    entries,
    entriesLoading,
    addEntry,
    deleteEntry,
    updateQuantity,
    templates,
    templatesLoading,
    addTemplate,
    deleteTemplate,
    todayTotal,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sewing-50/30">
      <Navbar todayTotal={todayTotal} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={context} />
      </main>
    </div>
  )
}

export const useAppContext = () => useOutletContext<AppContext>()
