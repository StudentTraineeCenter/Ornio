import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getHnizdiciDruhy } from '../api'

export default function HnizdiciWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['hnizdici'],
    queryFn: () => getHnizdiciDruhy(),
  })

  return (
    <section className="border-t border-gray-200 bg-white/60 p-3">
      <h3 className="mb-2 text-sm font-semibold text-emerald-800">
        Právě hnízdí
      </h3>
      {isLoading && <p className="text-sm text-gray-500">Načítám...</p>}
      {data?.length === 0 && (
        <p className="text-sm text-gray-500">Teď nehnízdí žádný druh.</p>
      )}
      <ul className="max-h-40 space-y-1 overflow-y-auto">
        {data?.map((d) => (
          <li key={d.id}>
            <Link
              to={`/encyklopedie/${d.id}`}
              className="block rounded px-2 py-1 text-sm hover:bg-emerald-50"
            >
              {d.nazev_cz}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}