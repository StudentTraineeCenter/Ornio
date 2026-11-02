import { Egg } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getHnizdiciPtak } from '../api'

export default function HnizdiciWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['hnizdici'],
    queryFn: () => getHnizdiciPtak(),
  })

  return (
    <section className="ornio-hnizdici-widget border-t border-line bg-lime/50 p-4">
      <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-pine">
        <Egg size={16} />
        Právě hnízdí
      </h3>
      {isLoading && <p className="text-sm text-muted">Načítám...</p>}
      {data?.length === 0 && (
        <p className="text-sm text-muted">Teď nehnízdí žádný druh.</p>
      )}
      <ul className="max-h-40 space-y-0.5 overflow-y-auto">
        {data?.map((d) => (
          <li key={d.id}>
            <Link
              to={`/encyklopedie/${d.id}`}
              className="block rounded-lg px-2 py-1.5 text-sm transition hover:bg-cream"
            >
              {d.nazev_cz}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}