import { useState } from 'react'
import { useAppContext } from '../Layout'
import { useStats } from '../../hooks/useStats'
import { StatsCards } from './StatsCards'
import { DateRangePicker } from './DateRangePicker'
import { DailyChart } from './DailyChart'
import { WeeklyChart } from './WeeklyChart'
import { MonthlyComparisonChart } from './MonthlyComparisonChart'
import { RecentEntries } from './RecentEntries'
import { getToday, toDateString } from '../../utils/dateHelpers'
import { subDays } from 'date-fns'
import type { WorkEntryDTO } from '../../types/dto'

const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

const TopModels = ({ entries }: { entries: WorkEntryDTO[] }) => {
  const byModel = new Map<string, number>()
  for (const e of entries) {
    byModel.set(e.model_name, (byModel.get(e.model_name) || 0) + Number(e.total_earned))
  }
  const sorted = Array.from(byModel.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
  const max = sorted.length > 0 ? sorted[0].total : 1

  if (sorted.length === 0) {
    return (
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4">Top Modele</h3>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-3xl mb-2">📭</span>
          <p className="text-gray-500 text-sm">Nu există date</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-bold text-gray-800 mb-4">Top Modele</h3>
      <div className="space-y-3">
        {sorted.map((m, i) => (
          <div key={m.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-sewing-500 to-primary-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-gray-700 truncate">{m.name}</span>
              </div>
              <span className="text-sm font-bold text-green-600">{formatMDL(m.total)}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sewing-500 to-primary-500 transition-all duration-500"
                style={{ width: `${max > 0 ? (m.total / max) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const DashboardPage = () => {
  const { entries } = useAppContext()
  const stats = useStats(entries)
  const [start, setStart] = useState(toDateString(subDays(new Date(), 29)))
  const [end, setEnd] = useState(getToday())

  const rangeEntries = entries.filter(
    (e) => e.work_date >= start && e.work_date <= end,
  )
  const rangeTotal = rangeEntries.reduce((s, e) => s + Number(e.total_earned), 0)
  const rangePieces = rangeEntries.reduce((s, e) => s + Number(e.quantity), 0)
  const rangeOps = rangeEntries.length

  return (
    <div className="space-y-6">
      <StatsCards
        entries={entries}
        todayTotal={stats.todayTotal}
        todayPieces={stats.todayPieces}
        todayOperations={stats.todayOperations}
        thisWeekTotal={stats.thisWeekTotal}
        lastWeekTotal={stats.lastWeekTotal}
        thisMonthTotal={stats.thisMonthTotal}
        lastMonthTotal={stats.lastMonthTotal}
        workingDaysThisMonth={stats.workingDaysThisMonth}
        avgPerDay={stats.avgPerDay}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DateRangePicker start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e) }} />
          <div className="card mt-6">
            <h3 className="font-bold text-gray-800 mb-3">Rezumat</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total câștig</span>
                <span className="text-lg font-bold text-green-600">{formatMDL(rangeTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total bucăți</span>
                <span className="font-semibold text-gray-800">{rangePieces}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Operații</span>
                <span className="font-semibold text-gray-800">{rangeOps}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card">
          <h3 className="font-bold text-gray-800 mb-4">Câștig Zilnic</h3>
          <DailyChart entries={entries} start={start} end={end} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Evoluție Săptămânală</h3>
          <WeeklyChart entries={entries} />
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Comparație Lunară</h3>
          <MonthlyComparisonChart entries={entries} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries entries={entries} start={start} end={end} />
        <TopModels entries={entries} />
      </div>
    </div>
  )
}
