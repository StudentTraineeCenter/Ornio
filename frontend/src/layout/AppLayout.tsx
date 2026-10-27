import { Outlet, useMatch } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const jeDetail =
    useMatch('/denik/:zapisnikId') || 
    useMatch('/encyklopedie/:druhId') ||
    useMatch('/denik/:zapisnikId') ||
    useMatch('/denik/:zapisnikId/upravit') ||
    useMatch('/encyklopedie/:druhId')

  return (
    <div className="flex h-screen bg-cream text-night">
      <aside
        className={`w-full shrink-0 flex-col border-r border-line bg-sand md:flex md:w-80 ${
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