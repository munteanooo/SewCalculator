import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { TemplateDTO, CreateTemplateDTO } from '../types/dto'

export const useTemplates = () => {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<TemplateDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchTemplates = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (user?.id) query = query.eq('user_id', user.id)

      const { data, error } = await query

      if (error) {
        console.error('Eroare la încărcarea șabloanelor:', error)
        return
      }

      setTemplates(
        (data || []).map((t) => ({
          ...t,
          cost_per_piece: Number(t.cost_per_piece),
        })) as TemplateDTO[],
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const addTemplate = useCallback(
    async (template: CreateTemplateDTO): Promise<boolean> => {
      if (!supabase) return false
      const isDuplicate = templates.some(
        (t) =>
          t.model_name.toLowerCase() === template.model_name.toLowerCase() &&
          t.operation_name.toLowerCase() === template.operation_name.toLowerCase() &&
          Number(t.cost_per_piece) === Number(template.cost_per_piece),
      )

      if (isDuplicate) return false

      try {
        const { data, error } = await supabase
          .from('templates')
          .insert({
            model_name: template.model_name,
            operation_name: template.operation_name,
            cost_per_piece: template.cost_per_piece,
            user_id: user?.id ?? undefined,
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') return false
          console.error('Eroare la salvarea șablonului:', error)
          return false
        }

        if (data) {
          setTemplates((prev) => [
            {
              ...data,
              cost_per_piece: Number(data.cost_per_piece),
            } as TemplateDTO,
            ...prev,
          ])
        }
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    [templates],
  )

  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    if (!supabase) return false
    try {
      const { error } = await supabase.from('templates').delete().eq('id', id)

      if (error) {
        console.error('Eroare la ștergerea șablonului:', error)
        return false
      }

      setTemplates((prev) => prev.filter((t) => t.id !== id))
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }, [])

  return { templates, loading, fetchTemplates, addTemplate, deleteTemplate }
}
