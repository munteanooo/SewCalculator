import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { useAppContext } from '../Layout'

export const QuickAdd = () => {
  const { templates, templatesLoading, deleteTemplate, addEntry } = useAppContext()
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  if (templates.length === 0 && !templatesLoading) return null

  const handleAdd = async (templateId: string, modelName: string, operationName: string, cost: number) => {
    const qty = parseInt(quantities[templateId] || '', 10)
    if (isNaN(qty) || qty <= 0) {
      toast.error('Introdu o cantitate validă')
      return
    }

    setSavingId(templateId)
    const ok = await addEntry({
      model_name: modelName,
      operation_name: operationName,
      cost_per_piece: cost,
      quantity: qty,
      work_date: (() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      })(),
    })
    setSavingId(null)

    if (ok) {
      toast.success(`✨ ${qty}x ${operationName} (${modelName}) = ${(qty * cost).toFixed(2)} MDL`)
      setQuantities((prev) => ({ ...prev, [templateId]: '' }))
    }
  }

  const handleDelete = async (templateId: string) => {
    await deleteTemplate(templateId)
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Adăugare Rapidă</h2>
      {templatesLoading ? (
        <p className="text-sm text-gray-500">Se încarcă șabloanele...</p>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="group flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-sewing-200 bg-gray-50/50 hover:bg-sewing-50/40 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {t.model_name} <span className="text-gray-400">→</span> {t.operation_name}
                </p>
                <p className="text-xs text-sewing-600 font-medium">
                  {Number(t.cost_per_piece).toFixed(2)} MDL/buc
                </p>
              </div>
              <input
                type="number"
                min="1"
                placeholder="buc"
                className="w-20 px-2 py-1.5 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-sewing-500/20 focus:border-sewing-500"
                value={quantities[t.id] || ''}
                onChange={(e) =>
                  setQuantities((prev) => ({ ...prev, [t.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd(t.id, t.model_name, t.operation_name, Number(t.cost_per_piece))
                  }
                }}
              />
              <button
                onClick={() => handleAdd(t.id, t.model_name, t.operation_name, Number(t.cost_per_piece))}
                disabled={savingId === t.id}
                className="bg-gradient-to-r from-sewing-500 to-primary-500 text-white p-2 rounded-lg shadow active:scale-95 disabled:opacity-50"
              >
                {savingId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                title="Șterge șablon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
