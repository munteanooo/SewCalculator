import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'
import type { WorkEntryDTO, MonthlyStatsDTO } from '../../types/dto'
import { calculateMonthlyStats } from '../../utils/dateHelpers'

interface MonthlyComparisonChartProps {
  entries: WorkEntryDTO[]
}

const COLORS = ['#d946ef', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: MonthlyStatsDTO }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null
  const m = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
      <p className="font-semibold text-gray-800 capitalize">{m.monthLabel}</p>
      <p className="text-sewing-600 font-bold">{formatMDL(m.totalEarned)}</p>
      <p className="text-xs text-gray-500">{m.totalPieces} bucăți • {m.workingDays} zile</p>
    </div>
  )
}

const PctBadge = ({ current, prev }: { current: number; prev: number }) => {
  if (prev === 0) {
    return <span className="text-xs text-gray-400">nou</span>
  }
  const pct = ((current - prev) / prev) * 100
  const up = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}

export const MonthlyComparisonChart = ({ entries }: MonthlyComparisonChartProps) => {
  const data = calculateMonthlyStats(entries, 6)

  const capitalized = data.map((m) => ({
    ...m,
    monthShort: m.monthLabel.charAt(0).toUpperCase() + m.monthLabel.slice(1),
  }))

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={capitalized} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="monthShort"
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="totalEarned" radius={[6, 6, 0, 0]} maxBarSize={48}>
              <LabelList
                dataKey="totalEarned"
                position="top"
                formatter={(v: number) => v.toFixed(0)}
                style={{ fontSize: 10, fill: '#9ca3af' }}
              />
              {capitalized.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        {data.map((m, i) => {
          const prev = i > 0 ? data[i - 1].totalEarned : 0
          return (
            <div key={m.month} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600 capitalize truncate">
                  {m.monthLabel.split(' ')[0]}
                </p>
                <PctBadge current={m.totalEarned} prev={prev} />
              </div>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{formatMDL(m.totalEarned)}</p>
              <p className="text-[11px] text-gray-400">{m.totalPieces} buc • {m.workingDays} zile</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
