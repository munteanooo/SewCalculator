import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subDays } from 'date-fns'
import { Calendar } from 'lucide-react'
import { toDateString, getToday, formatDateShort } from '../../utils/dateHelpers'

interface DateRangePickerProps {
  start: string
  end: string
  onChange: (start: string, end: string) => void
}

const PRESETS = [
  { label: 'Azi', get: () => { const t = getToday(); return [t, t] as [string, string] } },
  { label: '7 zile', get: () => { const t = new Date(); return [toDateString(subDays(t, 6)), toDateString(t)] as [string, string] } },
  { label: 'Săpt asta', get: () => { const n = new Date(); return [toDateString(startOfWeek(n, { weekStartsOn: 1 })), toDateString(endOfWeek(n, { weekStartsOn: 1 }))] as [string, string] } },
  { label: '30 zile', get: () => { const t = new Date(); return [toDateString(subDays(t, 29)), toDateString(t)] as [string, string] } },
  { label: 'Luna asta', get: () => { const n = new Date(); return [toDateString(startOfMonth(n)), toDateString(endOfMonth(n))] as [string, string] } },
  { label: '3 luni', get: () => { const n = new Date(); return [toDateString(startOfMonth(subMonths(n, 2))), toDateString(n)] as [string, string] } },
]

export const DateRangePicker = ({ start, end, onChange }: DateRangePickerProps) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-sewing-500" />
        <h3 className="font-bold text-gray-800">Interval</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(...p.get())}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-sewing-300 hover:text-sewing-600 hover:bg-sewing-50 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">De la</label>
          <input
            type="date"
            className="input-field"
            value={start}
            onChange={(e) => onChange(e.target.value, end)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Până la</label>
          <input
            type="date"
            className="input-field"
            value={end}
            onChange={(e) => onChange(start, e.target.value)}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {formatDateShort(start)} - {formatDateShort(end)}
      </p>
    </div>
  )
}
