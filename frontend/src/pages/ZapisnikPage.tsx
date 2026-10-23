import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getZapisnik } from '../api'
import type { UUID, Viditelnost } from '../types'

const viditelnostText: Record<Viditelnost, string> = {
  soukromy: 'Soukromý',
  pratele: 'Pro přátele',
  verejny: 'Veřejný',
}

const datum = (iso: string) =>
  new Date(iso).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })

const cas = (iso: string) =>
  new Date(iso).toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  })

export default function ZapisnikPage() {
  const { zapisnikId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['zapisnik', zapisnikId],
    queryFn: () => getZapisnik(zapisnikId as UUID),
    enabled: !!zapisnikId,
  })

  if (isLoading) return <p className="p-6 text-gray-500">Načítám...</p>
  if (isError || !data)
    return <p className="p-6 text-red-600">Výlet se nepodařilo načíst.</p>

  return (
    <article className="mx-auto max-w-2xl p-6">
      {/* Zpět na seznam (jen na mobilu) */}
      <Link
        to="/denik"
        className="mb-4 inline-block text-sm text-emerald-700 md:hidden"
      >
        ← Zpět na výlety
      </Link>

      <header className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-900">{data.nazev}</h2>
        <p className="mt-2 text-gray-700">
          {datum(data.cas_od)}, {cas(data.cas_od)}–{cas(data.cas_do)}
        </p>
        <p className="text-gray-700">
          {data.lokalita.nazev}, okr. {data.lokalita.okres}
        </p>
        <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs text-emerald-800">
          {viditelnostText[data.viditelnost]}
        </span>
      </header>

      <section className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Co jsem viděl</h3>
        {data.spatreni.length === 0 ? (
          <p className="text-gray-500">Zatím žádná spatření.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {data.spatreni.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/encyklopedie/${s.ptak_id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50"
                >
                  <span className="w-12 shrink-0 text-sm text-gray-500">
                    {cas(s.cas_pozorovani)}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{s.ptak.nazev_cz}</span>
                    <span className="block text-sm text-gray-600">
                      {s.chovani}
                      {s.poznamka && ` · ${s.poznamka}`}
                    </span>
                  </span>
                  <span className="text-emerald-700">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Poznámky</h3>
        <p className="whitespace-pre-line text-gray-700">
          {data.poznamky || 'Bez poznámek.'}
        </p>
      </section>
    </article>
  )
}