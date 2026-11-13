import { Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import DruhSearch from '../components/DruhSearch'
import HnizdiciWidget from '../components/HnizdiciWidget'
import ZapisnikList from '../components/ZapisnikList'

export default function Sidebar() {
  const { pathname } = useLocation()
  const jeEncyklopedie = pathname.startsWith('/encyklopedie')

  return (
    <>
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
            <ZapisnikList />
          </div>
          <HnizdiciWidget />
        </>
      )}
    </>
  )
}