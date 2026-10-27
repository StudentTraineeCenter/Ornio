import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Pencil, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getZapisnik, deleteZapisnik } from '../api'
import { cas, datum } from '../lib/format'
import type { UUID, Viditelnost } from '../types'

const viditelnostText: Record<Viditelnost, string> = {
  soukromy: 'Soukromý',
  pratele: 'Pro přátele',
  verejny: 'Veřejný',
}

export default function ZapisnikPage() {
  const { zapisnikId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['zapisnik', zapisnikId],
    queryFn: () => getZapisnik(zapisnikId as UUID),
    enabled: !!zapisnikId,
  })

  const navigate = useNavigate()
  const qc = useQueryClient()

  const smazat = useMutation({
  mutationFn: () => deleteZapisnik(zapisnikId as UUID),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['zapisniky'] })
    navigate('/denik')
  },
  })

  if (isLoading) return <p className="p-6 text-muted">Načítám...</p>
  if (isError || !data)
    return <p className="p-6 text-red-700">Výlet se nepodařilo načíst.</p>

  return (
    <article className="mx-auto max-w-3xl p-4 md:p-8">
      <Link
        to="/denik"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-fern md:hidden"
      >
        <ArrowLeft size={16} />
        Zpět na výlety
      </Link>

      <header className="mb-8 rounded-2xl bg-pine p-6 text-cream md:p-8">
        <span className="inline-block rounded-full bg-lime px-3 py-1 text-xs font-medium text-pine">
          {viditelnostText[data.viditelnost]}
        </span>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{data.nazev}</h2>
        <div className="mt-4 space-y-1.5 text-cream/90">
          <p className="flex items-center gap-2">
            <CalendarDays size={18} className="text-lime" />
            {datum(data.cas_od)}, {cas(data.cas_od)}–{cas(data.cas_do)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-lime" />
            {data.lokalita.nazev}, okr. {data.lokalita.okres}
          </p>
        </div>
      </header>

      <section className="mb-8">
        <h3 className="mb-3 text-2xl font-semibold text-pine">Co jsem viděl</h3>
        {data.spatreni.length === 0 ? (
          <p className="text-muted">Zatím žádná spatření.</p>
        ) : (
          <ul className="space-y-2">
            {data.spatreni.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/encyklopedie/${s.ptak_id}`}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-white/60 px-4 py-3 transition hover:border-moss hover:bg-lime/40"
                >
                  <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-muted">
                    {cas(s.cas_pozorovani)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium">
                      {s.ptak.nazev_cz}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-medium text-pine">
                        {s.chovani}
                      </span>
                      {s.poznamka && (
                        <span className="text-muted">{s.poznamka}</span>
                      )}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-fern transition group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-2xl font-semibold text-pine">Poznámky</h3>
        <p className="whitespace-pre-line rounded-xl border border-line bg-white/60 p-4 leading-relaxed">
          {data.poznamky || 'Bez poznámek.'}
        </p>
      </section>
      <div className="mt-8 flex gap-3">
  <Link
    to={`/denik/${data.id}/upravit`}
    className="inline-flex items-center gap-1.5 rounded-xl bg-pine px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-night"
  >
    <Pencil size={16} />
    Upravit
  </Link>
  <button
    type="button"
    disabled={smazat.isPending}
    onClick={() => {
      if (window.confirm('Opravdu smazat tento výlet?')) smazat.mutate()
    }}
    className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted transition hover:border-red-300 hover:text-red-700"
  >
    <Trash2 size={16} />
    Smazat
  </button>
</div>
    </article>
  )
}