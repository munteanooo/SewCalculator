import { NavLink } from 'react-router-dom'
import { Scissors } from 'lucide-react'

interface NavbarProps {
  todayTotal: number
}

export const Navbar = ({ todayTotal }: NavbarProps) => {
  const formatMDL = (value: number) =>
    `${value.toFixed(2).replace('.', '.')} MDL`

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

          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-semibold text-green-700">
              Azi: {formatMDL(todayTotal)}
            </span>
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
        </nav>
      </div>
    </header>
  )
}
