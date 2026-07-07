import { NavLink, useNavigate } from 'react-router-dom'
import { Scissors, LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NavbarProps {
  todayTotal: number
}

export const Navbar = ({ todayTotal }: NavbarProps) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const formatMDL = (value: number) => `${value.toFixed(2)} MDL`

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const userName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Utilizator'

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-sewing-500 to-primary-500 p-2 rounded-xl shadow-lg">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold bg-gradient-to-r from-sewing-600 to-primary-600 bg-clip-text text-transparent">
                Calculator Cusut
              </h1>
              <p className="text-[11px] text-gray-500 -mt-0.5">Fabrica de cusut</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
              }
            >
              Operațiuni
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
              }
            >
              Dashboard
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-700">
                Azi: {formatMDL(todayTotal)}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 pl-2 pr-1 py-1 rounded-full">
              <div className="bg-gradient-to-r from-sewing-500 to-primary-500 p-1.5 rounded-full">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                title="Deconectare"
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-2 pb-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link flex-1 justify-center ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            Operațiuni
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link flex-1 justify-center ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            Dashboard
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-link justify-center nav-link-inactive"
            title="Deconectare"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  )
}
