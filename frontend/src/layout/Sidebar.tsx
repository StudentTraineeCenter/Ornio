import { NavLink, useLocation } from 'react-router-dom'
import DruhSearch from '../components/DruhSearch'
import HnizdiciWidget from '../components/HnizdiciWidget'
import ZapisnikList from '../components/ZapisnikList'

const prepinac = ({ isActive }: { isActive: boolean }) =>
  `flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition ${
    isActive
      ? 'bg-white text-emerald-800 shadow-sm'
      : 'text-gray-600 hover:text-emerald-800'
  }`

export default function Sidebar() {
  const { pathname } = useLocation()
  const jeEncyklopedie = pathname.startsWith('/encyklopedie')

  return (
    <>
      <div className="border-b border-gray-200 p-3">
        <h1 className="mb-3 px-1 text-lg font-bold text-emerald-800">Ornio</h1>
        <div className="flex gap-1 rounded-lg bg-gray-200/70 p-1">
          <NavLink to="/denik" className={prepinac}>
            Deník
          </NavLink>
          <NavLink to="/encyklopedie" className={prepinac}>
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
            <ZapisnikList />
          </div>
          <HnizdiciWidget />
        </>
      )}
    </>
  )
}