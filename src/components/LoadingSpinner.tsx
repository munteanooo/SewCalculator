import { Scissors, Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  text?: string
}

export const LoadingSpinner = ({ text = 'Se încarcă...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sewing-500 to-primary-500 opacity-20 animate-pulse blur-xl" />
        <div className="relative bg-white rounded-full p-4 shadow-lg border border-gray-100">
          <Scissors className="w-8 h-8 text-sewing-500 animate-spin" style={{ animationDuration: '2s' }} />
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{text}</p>
    </div>
  )
}

export const ButtonSpinner = () => <Loader2 className="w-4 h-4 animate-spin" />
