import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { getDruhy } from '../api'

export default function DruhSearch() {
  const [q, setQ] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['druhy', q],
    queryFn: () => getDruhy(q),
  })

  return (
    <div>
      <div className="sticky top-0 border-b border-gray-200 bg-emerald-50 p-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hledat druh..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      {isLoading && <p className="p-4 text-sm text-gray-500">Načítám...</p>}
      {data?.length === 0 && (
        <p className="p-4 text-sm text-gray-500">Nic nenalezeno.</p>
      )}

      <ul>
        {data?.map((d) => (
          <li key={d.id}>
            <NavLink
              to={`/encyklopedie/${d.id}`}
              className={({ isActive }) =>
                `block border-b border-gray-100 px-4 py-3 transition ${
                  isActive ? 'bg-emerald-100' : 'hover:bg-emerald-50'
                }`
              }
            >
              <div className="font-medium">{d.nazev_cz}</div>
              <div className="text-sm italic text-gray-600">{d.nazev_lat}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}