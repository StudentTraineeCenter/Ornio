import { useState, type FormEvent } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createZapisnik,
  getPtaky,
  getLokality,
  getZapisnik,
  updateZapisnik,
} from '../api'
import type {
  UUID,
  Viditelnost,
  ZapisnikDetail,
  ZapisnikInput,
} from '../types'

interface Radek {
  key: string
  ptakText: string
  ptak_id: UUID | ''
  cas: string
  poznamka: string
}

interface FormState {
  nazev: string
  lokalita_id: UUID | ''
  datum: string
  od: string
  dokdy: string
  poznamky: string
  viditelnost: Viditelnost
  radky: Radek[]
}

const novyRadek = (cas: string): Radek => ({
  key: crypto.randomUUID(),
  ptakText: '',
  ptak_id: '',
  cas,
  poznamka: '',
})

const prazdny = (): FormState => ({
  nazev: '',
  lokalita_id: '',
  datum: new Date().toLocaleDateString('sv-SE'), // formát RRRR-MM-DD
  od: '08:00',
  dokdy: '10:00',
  poznamky: '',
  viditelnost: 'soukromy',
  radky: [],
})

const zDetailu = (z: ZapisnikDetail): FormState => ({
  nazev: z.nazev,
  lokalita_id: z.lokalita_id,
  datum: z.cas_od.slice(0, 10),
  od: z.cas_od.slice(11, 16),
  dokdy: z.cas_do.slice(11, 16),
  poznamky: z.poznamky,
  viditelnost: z.viditelnost,
  radky: z.spatreni.map((s) => ({
    key: s.id,
    ptakText: s.ptak.nazev_cz,
    ptak_id: s.ptak_id,
    cas: s.cas_pozorovani.slice(11, 16),
    poznamka: s.poznamka,
  })),
})

const pole =
  'w-full rounded-xl border border-line bg-white/70 px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-fern focus:ring-2 focus:ring-moss/40'

export default function ZapisnikFormPage() {
  const { zapisnikId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['zapisnik', zapisnikId],
    queryFn: () => getZapisnik(zapisnikId as UUID),
    enabled: !!zapisnikId,
  })

  if (zapisnikId && isLoading) return <p className="p-6 text-muted">Načítám...</p>
  if (zapisnikId && (isError || !data))
    return <p className="p-6 text-red-700">Výlet se nepodařilo načíst.</p>

  return (
    <ZapisnikForm
      key={zapisnikId ?? 'novy'}
      id={zapisnikId as UUID | undefined}
      initial={data ? zDetailu(data) : prazdny()}
    />
  )
}

function ZapisnikForm({ id, initial }: { id?: UUID; initial: FormState }) {
  const [f, setF] = useState<FormState>(initial)
  const [chyba, setChyba] = useState('')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: lokality } = useQuery({
    queryKey: ['lokality'],
    queryFn: getLokality,
  })
  const { data: ptaky } = useQuery({
    queryKey: ['ptaky', ''],
    queryFn: () => getPtaky(''),
  })

  const ulozit = useMutation({
    mutationFn: (input: ZapisnikInput) =>
      id ? updateZapisnik(id, input) : createZapisnik(input),
    onSuccess: async (z) => {
      await qc.invalidateQueries({ queryKey: ['zapisniky'] })
      qc.setQueryData(['zapisnik', z.id], z)
      navigate(`/denik/${z.id}`)
    },
  })

  const nastav = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((p) => ({ ...p, [k]: v }))

  const zmenRadek = (key: string, zmena: Partial<Radek>) =>
    setF((p) => ({
      ...p,
      radky: p.radky.map((r) => (r.key === key ? { ...r, ...zmena } : r)),
    }))

  const pridejRadek = () =>
    setF((p) => ({ ...p, radky: [...p.radky, novyRadek(p.od)] }))

  const odeberRadek = (key: string) =>
    setF((p) => ({ ...p, radky: p.radky.filter((r) => r.key !== key) }))

  // Druh se zadává do pole s našeptávačem, ID se dohledá podle názvu
  const vyberDruh = (key: string, text: string) => {
    const nalezen = ptaky?.find(
      (d) => d.nazev_cz.toLowerCase() === text.trim().toLowerCase(),
    )
    zmenRadek(key, { ptakText: text, ptak_id: nalezen ? nalezen.id : '' })
  }

  const odeslat = (e: FormEvent) => {
    e.preventDefault()
    if (!f.nazev.trim()) return setChyba('Vyplň název výletu.')
    if (!f.lokalita_id) return setChyba('Vyber lokalitu.')
    if (!f.datum) return setChyba('Vyber datum.')
    if (f.dokdy < f.od)
      return setChyba('Konec výletu nemůže být před jeho začátkem.')
    if (id && f.radky.some((r) => !r.ptak_id))
      return setChyba('U každého spatření vyber druh z nabídky.')

    setChyba('')
    ulozit.mutate({
      nazev: f.nazev.trim(),
      lokalita_id: f.lokalita_id,
      cas_od: `${f.datum}T${f.od}:00`,
      cas_do: `${f.datum}T${f.dokdy}:00`,
      poznamky: f.poznamky,
      viditelnost: f.viditelnost,
      spatreni: f.radky.map((r) => ({
        ptak_id: r.ptak_id as UUID,
        cas_pozorovani: `${f.datum}T${r.cas}:00`,
        poznamka: r.poznamka,
      })),
    })
  }

  const zpet = id ? `/denik/${id}` : '/denik'

  return (
    <form onSubmit={odeslat} className="mx-auto max-w-3xl p-4 md:p-8">
      <Link
        to={zpet}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-fern"
      >
        <ArrowLeft size={16} />
        Zpět
      </Link>

      <h2 className="mb-6 text-3xl font-semibold text-fern">
        {id ? 'Upravit výlet' : 'Nový výlet'}
      </h2>

      <div className="space-y-5">
        <Popisek text="Název výletu">
          <input
            className={pole}
            value={f.nazev}
            onChange={(e) => nastav('nazev', e.target.value)}
            placeholder="např. Ranní procházka u rybníka"
          />
        </Popisek>

        <Popisek text="Lokalita">
          <select
            className={pole}
            value={f.lokalita_id}
            onChange={(e) => nastav('lokalita_id', e.target.value as UUID)}
          >
            <option value="">Vyber lokalitu...</option>
            {lokality?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nazev} ({l.okres})
              </option>
            ))}
          </select>
        </Popisek>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Popisek text="Datum">
            <input
              type="date"
              className={pole}
              value={f.datum}
              onChange={(e) => nastav('datum', e.target.value)}
            />
          </Popisek>
          <Popisek text="Od">
            <input
              type="time"
              className={pole}
              value={f.od}
              onChange={(e) => nastav('od', e.target.value)}
            />
          </Popisek>
          <Popisek text="Do">
            <input
              type="time"
              className={pole}
              value={f.dokdy}
              onChange={(e) => nastav('dokdy', e.target.value)}
            />
          </Popisek>
        </div>

        <Popisek text="Viditelnost">
          <select
            className={pole}
            value={f.viditelnost}
            onChange={(e) => nastav('viditelnost', e.target.value as Viditelnost)}
          >
            <option value="soukromy">Soukromý (jen já)</option>
            <option value="pratele">Pro přátele</option>
            <option value="verejny">Veřejný</option>
          </select>
        </Popisek>

        <Popisek text="Poznámky">
          <textarea
            rows={4}
            className={pole}
            value={f.poznamky}
            onChange={(e) => nastav('poznamky', e.target.value)}
            placeholder="Počasí, dojmy, cokoli dalšího..."
          />
        </Popisek>

        {id && (
          <section>
            <h3 className="mb-3 text-2xl font-semibold text-fern">Co jsem viděl</h3>

            <datalist id="ptaky-nabidka">
              {ptaky?.map((d) => (
                <option key={d.id} value={d.nazev_cz} />
              ))}
            </datalist>

            <div className="space-y-3">
              {f.radky.map((r) => (
                <div
                  key={r.key}
                  className="rounded-xl border border-line bg-white/60 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
                    <input
                      list="ptaky-nabidka"
                      className={`${pole} ${
                        r.ptakText && !r.ptak_id ? 'border-red-400' : ''
                      }`}
                      value={r.ptakText}
                      onChange={(e) => vyberDruh(r.key, e.target.value)}
                      placeholder="Druh (začni psát...)"
                    />
                    <input
                      type="time"
                      className={pole}
                      value={r.cas}
                      onChange={(e) => zmenRadek(r.key, { cas: e.target.value })}
                    />
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => odeberRadek(r.key)}
                      aria-label="Odebrat spatření"
                      className="shrink-0 rounded-xl border border-line px-3 text-muted transition hover:border-red-300 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    className={`${pole} mt-3`}
                    value={r.poznamka}
                    onChange={(e) =>
                      zmenRadek(r.key, { poznamka: e.target.value })
                    }
                    placeholder="Poznámka ke spatření (nepovinné)"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={pridejRadek}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-moss px-4 py-2 text-sm font-medium text-fern transition hover:bg-lime/40"
            >
              <Plus size={16} />
              Přidat spatření
            </button>
          </section>
        )}
      </div>

      {chyba && <p className="mt-5 text-sm text-red-700">{chyba}</p>}
      {ulozit.isError && (
        <p className="mt-5 text-sm text-red-700">Uložení se nepodařilo.</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={ulozit.isPending}
          className="rounded-xl bg-pine px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-night disabled:opacity-60"
        >
          {ulozit.isPending ? 'Ukládám...' : 'Uložit'}
        </button>
        <Link
          to={zpet}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-sand"
        >
          Zrušit
        </Link>
      </div>
    </form>
  )
}

function Popisek({
  text,
  children,
}: {
  text: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fern">{text}</span>
      {children}
    </label>
  )
}