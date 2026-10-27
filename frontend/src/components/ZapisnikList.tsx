import { MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { getZapisniky } from '../api'
import { denMesic } from '../lib/format'

export default function ZapisnikList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['zapisniky'],
    queryFn: getZapisniky,
  })

  if (isLoading) return <p className="p-5 text-sm text-muted">Načítám...</p>
  if (isError)
    return (
      <p className="p-5 text-sm text-red-700">Výlety se nepodařilo načíst.</p>
    )
  if (!data?.length)
    return (
      <p className="p-5 text-sm text-muted">Zatím žádné výlety, zapiš první.</p>
    )

  return (
    <ul className="space-y-1.5 p-3">
      {data.map((z) => {
        const { den, mesic } = denMesic(z.cas_od)
        return (
          <li key={z.id}>
            <NavLink
              to={`/denik/${z.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  isActive
                    ? 'border-moss bg-lime'
                    : 'border-transparent hover:border-line hover:bg-cream'
                }`
              }
            >
              <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-pine text-cream">
                <span className="text-lg font-semibold leading-none">{den}</span>
                <span className="mt-0.5 text-[10px] uppercase leading-none tracking-wide text-lime">
                  {mesic}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{z.nazev}</span>
                <span className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted">
                  <MapPin size={13} className="shrink-0" />
                  <span className="truncate">{z.lokalita.nazev}</span>
                </span>
              </span>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}