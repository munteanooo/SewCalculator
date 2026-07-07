import { OperationForm } from '../components/operations/OperationForm'
import { QuickAdd } from '../components/operations/QuickAdd'
import { OperationList } from '../components/operations/OperationList'

export const OperationsPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <OperationForm />
        <QuickAdd />
      </div>
      <div className="lg:col-span-2">
        <OperationList />
      </div>
    </div>
  )
}
