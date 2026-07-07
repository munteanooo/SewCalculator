import { DollarSign, Calendar, Target, Hash, ArrowUp, ArrowDown } from 'lucide-react'
import type { WorkEntryDTO } from '../../types/dto'

interface StatsCardsProps {
  entries: WorkEntryDTO[]
  todayTotal: number
  todayPieces: number
  todayOperations: number
  thisWeekTotal: number
  lastWeekTotal: number
  thisMonthTotal: number
  lastMonthTotal: number
  workingDaysThisMonth: number
  avgPerDay: number
}

const formatMDL = (v: number) => `${v.toFixed(2)} MDL`

const TrendBadge = ({ current, prev }: { current: number; prev: number }) => {
  if (prev === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
        nou
      </span>
    )
  }
  const pct = ((current - prev) / prev) * 100
  const up = pct >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}

export const StatsCards = ({
  todayTotal,
  todayPieces,
  todayOperations,
  thisWeekTotal,
  lastWeekTotal,
  thisMonthTotal,
  lastMonthTotal,
  workingDaysThisMonth,
  avgPerDay,
}: StatsCardsProps) => {
  const cards = [
    {
      title: 'Câștig Azi',
      value: formatMDL(todayTotal),
      subtitle: `${todayPieces} bucăți • ${todayOperations} operații`,
      icon: DollarSign,
      gradient: 'from-green-400 to-emerald-500',
      badge: null as JSX.Element | null,
    },
    {
      title: 'Săptămâna Aceasta',
      value: formatMDL(thisWeekTotal),
      subtitle: `vs. săpt. trecută: ${lastWeekTotal.toFixed(2)} MDL`,
      icon: Calendar,
      gradient: 'from-blue-400 to-primary-500',
      badge: <TrendBadge current={thisWeekTotal} prev={lastWeekTotal} />,
    },
    {
      title: 'Luna Aceasta',
      value: formatMDL(thisMonthTotal),
      subtitle: `vs. luna trecută: ${lastMonthTotal.toFixed(2)} MDL`,
      icon: Target,
      gradient: 'from-sewing-400 to-sewing-600',
      badge: <TrendBadge current={thisMonthTotal} prev={lastMonthTotal} />,
    },
    {
      title: 'Media/Zi (luna asta)',
      value: formatMDL(avgPerDay),
      subtitle: `${workingDaysThisMonth} zile lucrate`,
      icon: Hash,
      gradient: 'from-amber-400 to-orange-500',
      badge: null as JSX.Element | null,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="stat-card">
          <div className="flex items-start justify-between">
            <div className={`bg-gradient-to-r ${c.gradient} p-2.5 rounded-xl shadow-lg`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            {c.badge}
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-800">{c.value}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">{c.title}</p>
          <p className="text-xs text-gray-400 mt-1">{c.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
