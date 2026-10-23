import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { getZapisniky } from '../api'

export default function ZapisnikList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['zapisniky'],
    queryFn: getZapisniky,
  })

  if (isLoading) return <p className="p-4 text-sm text-gray-500">Načítám...</p>
  if (isError)
    return <p className="p-4 text-sm text-red-600">Výlety se nepodařilo načíst.</p>
  if (!data?.length)
    return (
      <p className="p-4 text-sm text-gray-500">
        Zatím žádné výlety, zapiš první.
      </p>
    )

  return (
    <ul>
      {data.map((z) => (
        <li key={z.id}>
          <NavLink
            to={`/denik/${z.id}`}
            className={({ isActive }) =>
              `block border-b border-gray-100 px-4 py-3 transition ${
                isActive ? 'bg-emerald-100' : 'hover:bg-emerald-50'
              }`
            }
          >
            <div className="truncate font-medium">{z.nazev}</div>
            <div className="truncate text-sm text-gray-600">
              {new Date(z.cas_od).toLocaleDateString('cs-CZ')} · {z.lokalita.nazev}
            </div>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}