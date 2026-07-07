export interface WorkEntryDTO {
  id: string
  model_name: string
  operation_name: string
  cost_per_piece: number
  quantity: number
  total_earned: number
  work_date: string
  created_at: string
  updated_at: string
}

export interface CreateWorkEntryDTO {
  model_name: string
  operation_name: string
  cost_per_piece: number
  quantity: number
  work_date: string
}

export interface TemplateDTO {
  id: string
  model_name: string
  operation_name: string
  cost_per_piece: number
  created_at: string
}

export interface CreateTemplateDTO {
  model_name: string
  operation_name: string
  cost_per_piece: number
}

export interface DailyStatsDTO {
  date: string
  totalEarned: number
  totalPieces: number
  operationsCount: number
}

export interface WeeklyStatsDTO {
  weekStart: string
  weekEnd: string
  weekLabel: string
  totalEarned: number
  totalPieces: number
  avgPerDay: number
}

export interface MonthlyStatsDTO {
  month: string
  monthLabel: string
  totalEarned: number
  totalPieces: number
  workingDays: number
  avgPerDay: number
}
