import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Scissors, Mail, Lock, User as UserIcon, Loader2, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type Mode = 'login' | 'signup'

export const AuthPage = () => {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (mode === 'signup' && !fullName)) {
      toast.error('Completează toate câmpurile')
      return
    }
    setLoading(true)
    setInfo(null)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      setLoading(false)
      if (error) {
        toast.error(error)
        return
      }
      toast.success('Bine ai venit!')
      navigate('/', { replace: true })
    } else {
      const { error, needsConfirmation } = await signUp(email, password, fullName)
      setLoading(false)
      if (error) {
        toast.error(error)
        return
      }
      if (needsConfirmation) {
        setInfo('Ți-am trimis un email de confirmare. Verifică-ți inboxul pentru a activa contul.')
      } else {
        toast.success('Cont creat cu succes!')
        navigate('/', { replace: true })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sewing-50 via-gray-50 to-primary-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-sewing-500 to-primary-500 p-2.5 rounded-xl shadow-lg">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-bold bg-gradient-to-r from-sewing-600 to-primary-600 bg-clip-text text-transparent">
              Calculator Cusut
            </h1>
            <p className="text-xs text-gray-500">Fabrica de cusut</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-fade-in">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setInfo(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-white shadow text-sewing-600' : 'text-gray-500'}`}
            >
              Conectare
            </button>
            <button
              onClick={() => { setMode('signup'); setInfo(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white shadow text-sewing-600' : 'text-gray-500'}`}
            >
              Înregistrare
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nume</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="input-field pl-9"
                    placeholder="ex: Maria"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  className="input-field pl-9"
                  placeholder="email@exemplu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Parolă</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  className="input-field pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {info && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" /> Conectare
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Creează cont
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Datele tale sunt private și vizibile doar ție.
        </p>
      </div>
    </div>
  )
}
