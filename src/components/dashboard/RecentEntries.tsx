import { Scissors } from 'lucide-react'
import type { WorkEntryDTO } from '../../types/dto'
import { filterEntriesByDateRange, formatDateShort } from '../../utils/dateHelpers'

interface RecentEntriesProps {
  entries: WorkEntryDTO[]
  start: string
  end: string
}

export const RecentEntries = ({ entries, start, end }: RecentEntriesProps) => {
  const recent = filterEntriesByDateRange(entries, start, end)
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 10)

  return (
    <div className="card">
      <h3 className="font-bold text-gray-800 mb-4">Ultimele Înregistrări</h3>
      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-3xl mb-2">📭</span>
          <p className="text-gray-500 text-sm">Nicio înregistrare în interval</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
              <div className="bg-sewing-50 text-sewing-600 rounded-lg p-2 shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {e.model_name} <span className="text-gray-400">→</span> {e.operation_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateShort(e.work_date)} • {e.quantity} × {Number(e.cost_per_piece).toFixed(2)} MDL
                </p>
              </div>
              <span className="font-bold text-green-600 shrink-0 text-sm">+{Number(e.total_earned).toFixed(2)} MDL</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
