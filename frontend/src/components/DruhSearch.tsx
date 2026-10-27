import { useState } from 'react'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { getPtaky } from '../api'

export default function DruhSearch() {
  const [q, setQ] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['druhy', q],
    queryFn: () => getPtaky(q),
  })

  return (
    <div>
      <div className="sticky top-0 border-b border-line bg-sand p-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat druh..."
            className="w-full rounded-xl border border-line bg-cream py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted focus:border-fern focus:ring-2 focus:ring-moss/40"
          />
        </div>
      </div>

      {isLoading && <p className="p-5 text-sm text-muted">Načítám...</p>}
      {data?.length === 0 && (
        <p className="p-5 text-sm text-muted">Nic nenalezeno.</p>
      )}

      <ul className="space-y-1.5 p-3">
        {data?.map((d) => (
          <li key={d.id}>
            <NavLink
              to={`/encyklopedie/${d.id}`}
              className={({ isActive }) =>
                `block rounded-xl border px-3 py-2.5 transition ${
                  isActive
                    ? 'border-moss bg-lime'
                    : 'border-transparent hover:border-line hover:bg-cream'
                }`
              }
            >
              <div className="font-medium">{d.nazev_cz}</div>
              <div className="text-sm italic text-muted">{d.nazev_lat}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}