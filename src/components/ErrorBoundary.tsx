import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('Eroare de runtime:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h1 className="text-lg font-bold text-red-600 mb-2">A apărut o eroare</h1>
            <p className="text-sm text-gray-600 mb-4">
              Aplicația nu a putut fi încărcată. Deschide consola browserului (F12) pentru detalii.
            </p>
            <pre className="text-xs bg-gray-900 text-red-300 rounded-xl p-4 overflow-auto whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
