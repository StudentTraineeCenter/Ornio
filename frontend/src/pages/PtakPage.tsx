import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getDruh } from '../api'
import type { UUID } from '../types'

const mesice = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
]

export default function DruhPage() {
  const { druhId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['druh', druhId],
    queryFn: () => getDruh(druhId as UUID),
    enabled: !!druhId,
  })

  if (isLoading) return <p className="p-6 text-gray-500">Načítám...</p>
  if (isError || !data)
    return <p className="p-6 text-red-600">Druh se nepodařilo načíst.</p>

  return (
    <article className="mx-auto max-w-2xl p-6">
      <Link
        to="/encyklopedie"
        className="mb-4 inline-block text-sm text-emerald-700 md:hidden"
      >
        ← Zpět na encyklopedii
      </Link>

      <header className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-900">{data.nazev_cz}</h2>
        <p className="italic text-gray-600">{data.nazev_lat}</p>
        <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs text-emerald-800">
          {data.typ_ptaka.nazev}
        </span>
      </header>

      <Info nadpis="Jak ho poznat" text={data.jak_poznat} />
      <Info nadpis="Rozšíření" text={data.rozsireni} />
      <Info nadpis="Potrava" text={data.potrava} />
      <Info
        nadpis="Doba hnízdění"
        text={`${mesice[data.hnizdi_od_mesic - 1]} – ${mesice[data.hnizdi_do_mesic - 1]}`}
      />
    </article>
  )
}

function Info({ nadpis, text }: { nadpis: string; text: string }) {
  return (
    <section className="mb-5">
      <h3 className="mb-1 text-lg font-semibold">{nadpis}</h3>
      <p className="text-gray-700">{text}</p>
    </section>
  )
}