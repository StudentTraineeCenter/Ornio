import { BookOpen, Feather, Library, Menu, Moon, Sun, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const prepinac = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-pine text-cream shadow-sm'
      : 'text-muted hover:bg-cream/70 hover:text-pine'
  }`

export default function TopBar() {
  const [otevreno, setOtevreno] = useState(false)
  const [tmavyRezim, setTmavyRezim] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('ornio-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tmavyRezim)
    localStorage.setItem('ornio-theme', tmavyRezim ? 'dark' : 'light')
  }, [tmavyRezim])

  return (
    <header className="relative z-10 shrink-0 border-b border-line bg-sand">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <NavLink to="/denik" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-lime">
            <Feather size={20} />
          </span>
          <span className="text-2xl font-semibold text-pine">Ornio</span>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-xl bg-night/5 p-1 md:flex">
          <NavLink to="/denik" className={prepinac}>
            <BookOpen size={16} />
            Deník
          </NavLink>
          <NavLink to="/encyklopedie" className={prepinac}>
            <Library size={16} />
            Encyklopedie
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-muted transition hover:bg-cream/70 hover:text-pine"
            aria-label={tmavyRezim ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            aria-pressed={tmavyRezim}
            onClick={() => setTmavyRezim((aktualni) => !aktualni)}
          >
            {tmavyRezim ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-muted transition hover:bg-cream/70 hover:text-pine md:hidden"
            aria-label={otevreno ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={otevreno}
            onClick={() => setOtevreno((aktualni) => !aktualni)}
          >
            {otevreno ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {otevreno && (
        <nav className="border-t border-line px-4 py-3 md:hidden">
          <div className="grid gap-1 rounded-xl bg-night/5 p-1">
            <NavLink to="/denik" className={prepinac} onClick={() => setOtevreno(false)}>
              <BookOpen size={16} />
              Deník
            </NavLink>
            <NavLink
              to="/encyklopedie"
              className={prepinac}
              onClick={() => setOtevreno(false)}
            >
              <Library size={16} />
              Encyklopedie
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}
