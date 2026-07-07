import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { WorkEntryDTO, DailyStatsDTO } from '../../types/dto'
import { calculateDailyStats, formatDateShort, formatDate, getToday } from '../../utils/dateHelpers'

interface DailyChartProps {
  entries: WorkEntryDTO[]
  start: string
  end: string
}

const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: DailyStatsDTO & { isToday: boolean } }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null
  const d = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
      <p className="font-semibold text-gray-800 capitalize">{formatDate(d.date)}</p>
      <p className="text-green-600 font-bold">{formatMDL(d.totalEarned)}</p>
      <p className="text-xs text-gray-500">{d.totalPieces} bucăți • {d.operationsCount} operații</p>
    </div>
  )
}

export const DailyChart = ({ entries, start, end }: DailyChartProps) => {
  const stats = calculateDailyStats(entries, start, end)
  const today = getToday()
  const maxEarned = Math.max(...stats.map((s) => s.totalEarned), 1)

  const data = stats.map((s) => ({
    ...s,
    label: formatDateShort(s.date),
    isToday: s.date === today,
  }))

  const getColor = (s: DailyStatsDTO & { isToday: boolean }) => {
    if (s.isToday) return '#d946ef'
    if (s.totalEarned === 0) return '#e5e7eb'
    const opacity = 0.4 + 0.6 * (s.totalEarned / maxEarned)
    return `rgba(59, 130, 246, ${opacity.toFixed(2)})`
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-gray-500 font-medium">Nicio dată în intervalul selectat</p>
      </div>
    )
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="totalEarned" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((d, i) => (
              <Cell key={i} fill={getColor(d)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
