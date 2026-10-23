import { Outlet, useMatch } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  // Na mobilu ukazujeme buď seznam, nebo detail (jako v chatovací appce)
  const denikDetail = useMatch('/denik/:zapisnikId')
  const encyklopedieDetail = useMatch('/encyklopedie/:druhId')
  const jeDetail =
    denikDetail || encyklopedieDetail

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <aside
        className={`w-full shrink-0 flex-col border-r border-gray-200 bg-emerald-50/40 md:flex md:w-80 ${
          jeDetail ? 'hidden' : 'flex'
        }`}
      >
        <Sidebar />
      </aside>

      <main
        className={`flex-1 overflow-y-auto md:block ${
          jeDetail ? 'block' : 'hidden'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}