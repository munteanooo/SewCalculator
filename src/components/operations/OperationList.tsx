import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Scissors, Trash2, Loader2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../Layout'
import { getToday, formatDate, formatDayOfWeek, formatDateShort } from '../../utils/dateHelpers'
import type { WorkEntryDTO } from '../../types/dto'

const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

const EntryCard = ({
  entry,
  deleting,
  onDelete,
}: {
  entry: WorkEntryDTO
  deleting: boolean
  onDelete: (id: string) => void
}) => {
  const { updateQuantity } = useAppContext()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(entry.quantity))

  const handleSave = async () => {
    const qty = parseInt(editValue, 10)
    if (isNaN(qty) || qty <= 0) {
      toast.error('Cantitate invalidă')
      return
    }
    const ok = await updateQuantity(entry.id, qty)
    if (ok) {
      toast.success('Cantitate actualizată')
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(String(entry.quantity))
    setEditing(false)
  }

  return (
    <div className="group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all animate-fade-in">
      <div className="bg-sewing-50 text-sewing-600 rounded-lg p-2 shrink-0">
        <Scissors className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {entry.model_name} <span className="text-gray-400">→</span> {entry.operation_name}
        </p>
        <p className="text-sm text-gray-500">
          {Number(entry.cost_per_piece).toFixed(2)} MDL/buc •{' '}
          {editing ? (
            <span className="inline-flex items-center gap-1">
              <input
                type="number"
                min="1"
                autoFocus
                className="w-16 px-2 py-0.5 text-sm rounded border border-gray-200 outline-none focus:border-sewing-500"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
              />
              <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </span>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="font-medium text-gray-600 hover:text-sewing-600 underline decoration-dotted"
              title="Editează cantitatea"
            >
              {entry.quantity} buc
            </button>
          )}
        </p>
      </div>
      <span className="font-bold text-green-600 shrink-0">+{Number(entry.total_earned).toFixed(2)} MDL</span>
      <button
        onClick={() => onDelete(entry.id)}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  )
}

export const OperationList = () => {
  const { entries, entriesLoading, deleteEntry } = useAppContext()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const today = getToday()
  const todayEntries = entries.filter((e) => e.work_date === today)
  const todayTotal = todayEntries.reduce((s, e) => s + Number(e.total_earned), 0)

  const previousEntries = entries.filter((e) => e.work_date !== today)
  const dateGroups = new Map<string, WorkEntryDTO[]>()
  for (const e of previousEntries) {
    if (!dateGroups.has(e.work_date)) dateGroups.set(e.work_date, [])
    dateGroups.get(e.work_date)!.push(e)
  }
  const sortedDates = Array.from(dateGroups.keys()).sort((a, b) => (a < b ? 1 : -1))
  const visibleDates = showAll ? sortedDates : sortedDates.slice(0, 3)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteEntry(id)
    setDeletingId(null)
  }

  if (entriesLoading) {
    return (
      <div className="card">
        <p className="text-gray-500">Se încarcă...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Operațiile de Azi</h2>
            <p className="text-sm text-gray-500 capitalize">
              {formatDate(today)} • {formatDayOfWeek(today)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{formatMDL(todayTotal)}</p>
            <p className="text-xs text-gray-500">{todayEntries.length} operații</p>
          </div>
        </div>

        {todayEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🧵</span>
            <p className="text-gray-500 font-medium">Nicio operațiune adăugată azi</p>
            <p className="text-sm text-gray-400">Folosește formularul pentru a începe</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayEntries.map((e) => (
              <EntryCard
                key={e.id}
                entry={e}
                deleting={deletingId === e.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {sortedDates.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Zilele Anterioare</h2>
          <div className="space-y-5">
            {visibleDates.map((date) => {
              const groupEntries = dateGroups.get(date)!
              const groupTotal = groupEntries.reduce((s, e) => s + Number(e.total_earned), 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 capitalize">
                      {formatDateShort(date)}
                    </p>
                    <p className="text-sm font-semibold text-green-600">{formatMDL(groupTotal)}</p>
                  </div>
                  <div className="space-y-2">
                    {groupEntries.map((e) => (
                      <EntryCard
                        key={e.id}
                        entry={e}
                        deleting={deletingId === e.id}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {sortedDates.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-sewing-600 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              {showAll ? (
                <>
                  Arată mai puține <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Arată toate <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
