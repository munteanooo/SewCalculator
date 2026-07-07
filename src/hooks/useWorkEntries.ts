import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'
import type { WorkEntryDTO, CreateWorkEntryDTO } from '../types/dto'

export const useWorkEntries = () => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<WorkEntryDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchEntries = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      let query = supabase
        .from('work_entries')
        .select('*')
        .order('work_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (user?.id) query = query.eq('user_id', user.id)

      const { data, error } = await query

      if (error) {
        console.error('Eroare la încărcarea operațiunilor:', error)
        toast.error('Nu s-au putut încărca operațiunile')
        return
      }

      setEntries(
        (data || []).map((e) => ({
          ...e,
          cost_per_piece: Number(e.cost_per_piece),
          total_earned: Number(e.total_earned),
          quantity: Number(e.quantity),
        })) as WorkEntryDTO[],
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    fetchEntries()

    const channel = supabase
      .channel('work_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'work_entries' },
        () => {
          fetchEntries()
        },
      )
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [fetchEntries])

  const addEntry = useCallback(
    async (entry: CreateWorkEntryDTO): Promise<boolean> => {
      if (!supabase) {
        toast.error('Supabase nu este configurat')
        return false
      }
      try {
        const { error } = await supabase.from('work_entries').insert({
          model_name: entry.model_name,
          operation_name: entry.operation_name,
          cost_per_piece: entry.cost_per_piece,
          quantity: entry.quantity,
          work_date: entry.work_date,
          user_id: user?.id ?? undefined,
        })

        if (error) {
          console.error('Eroare la adăugarea operațiunii:', error)
          toast.error('Nu s-a putut adăuga operațiunea')
          return false
        }

        await fetchEntries()
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    [fetchEntries],
  )

  const deleteEntry = useCallback(
    async (id: string): Promise<boolean> => {
      if (!supabase) {
        toast.error('Supabase nu este configurat')
        return false
      }
      try {
        const { error } = await supabase.from('work_entries').delete().eq('id', id)

        if (error) {
          console.error('Eroare la ștergerea operațiunii:', error)
          toast.error('Nu s-a putut șterge operațiunea')
          return false
        }

        setEntries((prev) => prev.filter((e) => e.id !== id))
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    [],
  )

  const updateQuantity = useCallback(
    async (id: string, quantity: number): Promise<boolean> => {
      if (!supabase) {
        toast.error('Supabase nu este configurat')
        return false
      }
      try {
        const { error } = await supabase
          .from('work_entries')
          .update({ quantity })
          .eq('id', id)

        if (error) {
          console.error('Eroare la actualizarea cantității:', error)
          toast.error('Nu s-a putut actualiza cantitatea')
          return false
        }

        await fetchEntries()
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    [fetchEntries],
  )

  return { entries, loading, fetchEntries, addEntry, deleteEntry, updateQuantity }
}
