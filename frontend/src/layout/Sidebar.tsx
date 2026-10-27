import { BookOpen, Feather, Library, Plus } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import DruhSearch from '../components/DruhSearch'
import HnizdiciWidget from '../components/HnizdiciWidget'
import ZapisnikList from '../components/ZapisnikList'

const prepinac = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-pine text-cream shadow-sm'
      : 'text-muted hover:text-pine'
  }`

export default function Sidebar() {
  const { pathname } = useLocation()
  const jeEncyklopedie = pathname.startsWith('/encyklopedie')

  return (
    <>
      <div className="border-b border-line p-4">
        <div className="mb-4 flex items-center gap-2 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-lime">
            <Feather size={20} />
          </span>
          <h1 className="text-2xl font-semibold text-pine">Ornio</h1>
        </div>

        <div className="flex gap-1 rounded-xl bg-night/5 p-1">
          <NavLink to="/denik" className={prepinac}>
            <BookOpen size={16} />
            Deník
          </NavLink>
          <NavLink to="/encyklopedie" className={prepinac}>
            <Library size={16} />
            Encyklopedie
          </NavLink>
        </div>
      </div>

      {jeEncyklopedie ? (
        <div className="flex-1 overflow-y-auto">
          <DruhSearch />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
          <div className="p-3 pb-0">
           <Link
             to="/denik/novy"
             className="flex items-center justify-center gap-1.5 rounded-xl bg-pine px-3 py-2.5 text-sm font-medium text-cream transition hover:bg-night"
           >
             <Plus size={16} />
             Nový výlet
            </Link>
         </div>
        </div>
          <div className="flex-1 overflow-y-auto">
            <ZapisnikList />
          </div>
          <HnizdiciWidget />
        </>
      )}
    </>
  )
}