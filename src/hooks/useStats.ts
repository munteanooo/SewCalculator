import { useMemo } from 'react'
import { parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import type { WorkEntryDTO } from '../types/dto'

const sumEarned = (entries: WorkEntryDTO[]) =>
  entries.reduce((s, e) => s + Number(e.total_earned), 0)
const sumPieces = (entries: WorkEntryDTO[]) =>
  entries.reduce((s, e) => s + Number(e.quantity), 0)

export const useStats = (entries: WorkEntryDTO[]) => {
  return useMemo(() => {
    const now = new Date()
    const todayStr = (() => {
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    })()

    const todayEntries = entries.filter((e) => e.work_date === todayStr)
    const todayTotal = sumEarned(todayEntries)
    const todayPieces = sumPieces(todayEntries)
    const todayOperations = todayEntries.length

    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const thisWeekInterval = { start: weekStart, end: weekEnd }
    const thisWeekEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.work_date), thisWeekInterval),
    )
    const thisWeekTotal = sumEarned(thisWeekEntries)

    const lastWeekInterval = {
      start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
    }
    const lastWeekEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.work_date), lastWeekInterval),
    )
    const lastWeekTotal = sumEarned(lastWeekEntries)

    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const thisMonthInterval = { start: monthStart, end: monthEnd }
    const thisMonthEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.work_date), thisMonthInterval),
    )
    const thisMonthTotal = sumEarned(thisMonthEntries)

    const lastMonthInterval = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    }
    const lastMonthEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.work_date), lastMonthInterval),
    )
    const lastMonthTotal = sumEarned(lastMonthEntries)

    const workingDaysThisMonth = new Set(thisMonthEntries.map((e) => e.work_date)).size
    const avgPerDay = workingDaysThisMonth > 0 ? thisMonthTotal / workingDaysThisMonth : 0

    return {
      todayTotal,
      todayPieces,
      todayOperations,
      thisWeekTotal,
      lastWeekTotal,
      thisMonthTotal,
      lastMonthTotal,
      workingDaysThisMonth,
      avgPerDay,
    }
  }, [entries])
}
