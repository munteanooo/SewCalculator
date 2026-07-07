import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Loader2 } from 'lucide-react'
import { useAppContext } from '../Layout'
import { getToday } from '../../utils/dateHelpers'

export const OperationForm = () => {
  const { addEntry, addTemplate } = useAppContext()
  const [modelName, setModelName] = useState('')
  const [operationName, setOperationName] = useState('')
  const [costPerPiece, setCostPerPiece] = useState('')
  const [quantity, setQuantity] = useState('')
  const [workDate, setWorkDate] = useState(getToday())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setWorkDate(getToday())
  }, [])

  const costNum = parseFloat(costPerPiece)
  const qtyNum = parseInt(quantity, 10)
  const hasPreview = costPerPiece !== '' && quantity !== '' && !isNaN(costNum) && !isNaN(qtyNum) && qtyNum > 0
  const previewTotal = hasPreview ? costNum * qtyNum : 0

  const canSubmit =
    modelName.trim() !== '' &&
    operationName.trim() !== '' &&
    !isNaN(costNum) &&
    costNum >= 0 &&
    !isNaN(qtyNum) &&
    qtyNum > 0 &&
    !saving

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSaving(true)
    const ok = await addEntry({
      model_name: modelName.trim(),
      operation_name: operationName.trim(),
      cost_per_piece: costNum,
      quantity: qtyNum,
      work_date: workDate,
    })
    setSaving(false)

    if (ok) {
      toast.success(
        `✨ ${qtyNum}x ${operationName.trim()} (${modelName.trim()}) = ${previewTotal.toFixed(2)} MDL`,
      )
      await addTemplate({
        model_name: modelName.trim(),
        operation_name: operationName.trim(),
        cost_per_piece: costNum,
      })
      setQuantity('')
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Adaugă Operațiune</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Model
          </label>
          <input
            className="input-field"
            placeholder="ex: Maiou, Rochie"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Operațiune
          </label>
          <input
            className="input-field"
            placeholder="ex: Guler, Manșetă"
            value={operationName}
            onChange={(e) => setOperationName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Cost / bucată (MDL)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0.90"
              value={costPerPiece}
              onChange={(e) => setCostPerPiece(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Cantitate
            </label>
            <input
              type="number"
              min="1"
              className="input-field"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Data
          </label>
          <input
            type="date"
            className="input-field"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
          />
        </div>

        {hasPreview && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-fade-in">
            <p className="text-sm text-green-700 font-medium">
              {qtyNum} × {costNum.toFixed(2)} MDL ={' '}
              <span className="text-lg font-bold text-green-700">
                {previewTotal.toFixed(2)} MDL
              </span>
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={!canSubmit}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Se salvează...' : 'Adaugă Operațiune'}
        </button>
      </form>
    </div>
  )
}
