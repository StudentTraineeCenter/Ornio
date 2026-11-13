import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  const { pathname } = useLocation()
  const jeDetail = pathname !== '/denik' && pathname !== '/encyklopedie' && pathname !== '/'

  return (
    <div className="flex h-screen flex-col bg-cream text-night">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <aside
          className={`w-full shrink-0 flex-col border-r border-line bg-sand md:flex md:w-80 ${
            jeDetail ? 'hidden' : 'flex'
          }`}
        >
          <Sidebar />
        </aside>

        <main
          className={`min-w-0 flex-1 overflow-y-auto md:block ${
            jeDetail ? 'block' : 'hidden'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}