import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { subMonths } from 'date-fns'
import type { WorkEntryDTO, WeeklyStatsDTO } from '../../types/dto'
import { calculateWeeklyStats, toDateString, getToday } from '../../utils/dateHelpers'

interface WeeklyChartProps {
  entries: WorkEntryDTO[]
}

const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: WeeklyStatsDTO }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null
  const w = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
      <p className="font-semibold text-gray-800">{w.weekLabel}</p>
      <p className="text-sewing-600 font-bold">{formatMDL(w.totalEarned)}</p>
      <p className="text-xs text-gray-500">{w.totalPieces} bucăți • media: {formatMDL(w.avgPerDay)}/zi</p>
    </div>
  )
}

export const WeeklyChart = ({ entries }: WeeklyChartProps) => {
  const now = new Date()
  const start = toDateString(subMonths(now, 3))
  const end = getToday()
  const data = calculateWeeklyStats(entries, start, end)

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-gray-500 font-medium">Nu există date săptămânale</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="weekLabel"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalEarned"
            stroke="#d946ef"
            strokeWidth={2}
            fill="url(#weeklyGradient)"
            dot={{ r: 3, fill: '#d946ef' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
