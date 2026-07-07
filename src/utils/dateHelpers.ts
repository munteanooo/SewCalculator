import {
  format,
  parseISO,
  isWithinInterval,
  eachDayOfInterval,
  endOfWeek,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
} from 'date-fns'
import type { Interval } from 'date-fns'
import { ro } from 'date-fns/locale'
import type {
  WorkEntryDTO,
  DailyStatsDTO,
  WeeklyStatsDTO,
  MonthlyStatsDTO,
} from '../types/dto'

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy', { locale: ro })
}

export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM', { locale: ro })
}

export const formatDayOfWeek = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEEE', { locale: ro })
}

export const toDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const filterEntriesByDate = (
  entries: WorkEntryDTO[],
  dateStr: string,
): WorkEntryDTO[] => {
  return entries.filter((e) => e.work_date === dateStr)
}

export const filterEntriesByDateRange = (
  entries: WorkEntryDTO[],
  start: string,
  end: string,
): WorkEntryDTO[] => {
  const startD = startOfDay(parseISO(start))
  const endD = endOfDay(parseISO(end))
  return entries.filter((e) =>
    isWithinInterval(parseISO(e.work_date), { start: startD, end: endD }),
  )
}

export const calculateDailyStats = (
  entries: WorkEntryDTO[],
  start: string,
  end: string,
): DailyStatsDTO[] => {
  const days = eachDayOfInterval({ start: parseISO(start), end: parseISO(end) })
  return days.map((day) => {
    const dateStr = toDateString(day)
    const dayEntries = entries.filter((e) => e.work_date === dateStr)
    return {
      date: dateStr,
      totalEarned: dayEntries.reduce((sum, e) => sum + Number(e.total_earned), 0),
      totalPieces: dayEntries.reduce((sum, e) => sum + Number(e.quantity), 0),
      operationsCount: dayEntries.length,
    }
  })
}

export const calculateWeeklyStats = (
  entries: WorkEntryDTO[],
  start: string,
  end: string,
): WeeklyStatsDTO[] => {
  const weeks = eachWeekOfInterval(
    { start: parseISO(start), end: parseISO(end) },
    { weekStartsOn: 1 },
  )
  return weeks.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    const interval: Interval = { start: startOfDay(weekStart), end: endOfDay(weekEnd) }
    const weekEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.work_date), interval),
    )
    const totalEarned = weekEntries.reduce((s, e) => s + Number(e.total_earned), 0)
    const totalPieces = weekEntries.reduce((s, e) => s + Number(e.quantity), 0)
    const daysWithEntries = new Set(weekEntries.map((e) => e.work_date)).size
    return {
      weekStart: toDateString(weekStart),
      weekEnd: toDateString(weekEnd),
      weekLabel: `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`,
      totalEarned,
      totalPieces,
      avgPerDay: daysWithEntries > 0 ? totalEarned / daysWithEntries : 0,
    }
  })
}

export const calculateMonthlyStats = (
  entries: WorkEntryDTO[],
  n = 6,
): MonthlyStatsDTO[] => {
  const now = new Date()
  const months: MonthlyStatsDTO[] = []
  for (let i = n - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i)
    const mStart = startOfMonth(monthDate)
    const mEnd = endOfMonth(monthDate)
    const monthEntries = entries.filter((e) => {
      const d = parseISO(e.work_date)
      return d >= mStart && d <= mEnd
    })
    const totalEarned = monthEntries.reduce((s, e) => s + Number(e.total_earned), 0)
    const totalPieces = monthEntries.reduce((s, e) => s + Number(e.quantity), 0)
    const workingDays = new Set(monthEntries.map((e) => e.work_date)).size
    months.push({
      month: format(monthDate, 'yyyy-MM'),
      monthLabel: format(monthDate, 'MMMM yyyy', { locale: ro }),
      totalEarned,
      totalPieces,
      workingDays,
      avgPerDay: workingDays > 0 ? totalEarned / workingDays : 0,
    })
  }
  return months
}
