import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { addSpatreni, deleteZapisnik, getPtaky, getZapisnik } from '../api'
import { cas, datum } from '../lib/format'
import type { SpatreniInput, UUID, Viditelnost } from '../types'

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
                  className="group flex items-center gap-4 rounded-xl border border-line bg-white/60 px-4 py-3 no-underline transition hover:border-moss hover:bg-lime/40"
                >
                  <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-muted">
                    {cas(s.cas_pozorovani)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium">
                      {s.ptak.nazev_cz}
                    </span>
                    <span className="mt-2 block text-sm text-muted">
                      <span className="font-medium text-pine">Poznámky:</span>{' '}
                      {s.poznamka || 'bez poznámky'}
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
        <PridatSpatreni zapisnikId={data.id} datum={data.cas_od.slice(0, 10)} />
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

function PridatSpatreni({
  zapisnikId,
  datum,
}: {
  zapisnikId: UUID
  datum: string
}) {
  const [otevreno, setOtevreno] = useState(false)
  const [ptakId, setPtakId] = useState<UUID | ''>('')
  const [casPozorovani, setCasPozorovani] = useState('08:00')
  const [poznamka, setPoznamka] = useState('')
  const [chyba, setChyba] = useState('')
  const queryClient = useQueryClient()

  const { data: ptaky } = useQuery({
    queryKey: ['ptaky', ''],
    queryFn: () => getPtaky(''),
    enabled: otevreno,
  })

  const pridat = useMutation({
    mutationFn: (input: SpatreniInput) => addSpatreni(zapisnikId, input),
    onSuccess: (zapisnik) => {
      queryClient.setQueryData(['zapisnik', zapisnikId], zapisnik)
      setPtakId('')
      setPoznamka('')
      setOtevreno(false)
      setChyba('')
    },
  })

  const odeslat = (event: FormEvent) => {
    event.preventDefault()
    if (!ptakId) {
      setChyba('Vyber druh ptáka.')
      return
    }

    pridat.mutate({
      ptak_id: ptakId,
      cas_pozorovani: `${datum}T${casPozorovani}:00`,
      poznamka: poznamka.trim(),
    })
  }

  if (!otevreno) {
    return (
      <button
        type="button"
        onClick={() => setOtevreno(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-moss px-4 py-2 text-sm font-medium text-fern transition hover:bg-lime/40"
      >
        <Plus size={16} />
        Přidat spatření
      </button>
    )
  }

  return (
    <form
      onSubmit={odeslat}
      className="mt-4 rounded-xl border border-line bg-white/60 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <select
          value={ptakId}
          onChange={(event) => setPtakId(event.target.value as UUID)}
          className="w-full rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
        >
          <option value="">Vyber druh...</option>
          {ptaky?.map((ptak) => (
            <option key={ptak.id} value={ptak.id}>
              {ptak.nazev_cz}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={casPozorovani}
          onChange={(event) => setCasPozorovani(event.target.value)}
          className="w-full rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
        />
      </div>
      <input
        value={poznamka}
        onChange={(event) => setPoznamka(event.target.value)}
        placeholder="Poznámka (nepovinná)"
        className="mt-3 w-full rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
      />
      {chyba && <p className="mt-3 text-sm text-red-700">{chyba}</p>}
      {pridat.isError && (
        <p className="mt-3 text-sm text-red-700">Pozorování se nepodařilo přidat.</p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pridat.isPending}
          className="rounded-xl bg-pine px-4 py-2 text-sm font-medium text-cream disabled:opacity-60"
        >
          {pridat.isPending ? 'Přidávám...' : 'Přidat'}
        </button>
        <button
          type="button"
          onClick={() => setOtevreno(false)}
          className="rounded-xl border border-line px-4 py-2 text-sm text-muted"
        >
          Zrušit
        </button>
      </div>
    </form>
  )
}