import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getPtak } from '../api'
import type { UUID } from '../types'

const mesice = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']

export default function DruhPage() {
  const { druhId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['druh', druhId],
    queryFn: () => getPtak(druhId as UUID),
    enabled: !!druhId,
  })

  if (isLoading) return <p className="p-6 text-muted">Načítám...</p>
  if (isError || !data)
    return <p className="p-6 text-red-700">Druh se nepodařilo načíst.</p>

  const hnizdi = (m: number) =>
    data.hnizdi_od_mesic <= data.hnizdi_do_mesic
      ? m >= data.hnizdi_od_mesic && m <= data.hnizdi_do_mesic
      : m >= data.hnizdi_od_mesic || m <= data.hnizdi_do_mesic

  return (
    <article className="mx-auto max-w-3xl p-4 md:p-8">
      <Link
        to="/encyklopedie"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-fern md:hidden"
      >
        <ArrowLeft size={16} />
        Zpět na encyklopedii
      </Link>

      <header className="ornio-detail-header mb-8 rounded-2xl bg-pine p-6 text-cream md:p-8">
        <span className="inline-block rounded-full bg-lime px-3 py-1 text-xs font-medium text-pine">
          {data.typ_ptaka.nazev}
        </span>
        <h2 className="mt-3 text-3xl font-semibold text-cream md:text-4xl">
          {data.nazev_cz}
        </h2>
        <p className="mt-1 text-lg italic text-lime">{data.nazev_lat}</p>
      </header>

      <div className="space-y-6">
        <Blok nadpis="Jak ho poznat" text={data.jak_poznat} />
        <Blok nadpis="Rozšíření" text={data.rozsireni} />
        <Blok nadpis="Potrava" text={data.potrava} />

        <section>
          <h3 className="mb-3 text-2xl font-semibold text-fern">
            Doba hnízdění
          </h3>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
            {mesice.map((nazev, i) => (
              <div
                key={nazev}
                className={`rounded-lg py-2 text-center text-xs font-medium ${
                  hnizdi(i + 1)
                    ? 'bg-fern text-cream'
                    : 'bg-sand text-muted'
                }`}
              >
                {nazev}
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}

function Blok({ nadpis, text }: { nadpis: string; text: string }) {
  return (
    <section>
      <h3 className="mb-2 text-2xl font-semibold text-fern">{nadpis}</h3>
      <p className="leading-relaxed">{text}</p>
    </section>
  )
}