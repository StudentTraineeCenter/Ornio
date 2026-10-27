import type { data } from 'react-router-dom'
import { 
  ptaky, lokality, spatreni, typyPtaku, zapisniky, USER_ID
} from '../mocks/data'

import type {
  Ptaka,
  PtakaDetail,
  UUID,
  ZapisnikDetail,
  ZapisnikSeznam,
  Lokalita,
  Zapisnik,
  ZapisnikInput,
  SpatreniInput
} from '../types'

// Simulace zpoždění sítě, ať vidíme načítání
const latency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getZapisniky(): Promise<ZapisnikSeznam[]> {
  await latency()
  return zapisniky
    .map((z) => ({
      ...z,
      lokalita: lokality.find((l) => l.id === z.lokalita_id)!,
    }))
    .sort((a, b) => b.cas_od.localeCompare(a.cas_od))
}

export async function getZapisnik(id: UUID): Promise<ZapisnikDetail> {
  await latency()
  const zapisnik = zapisniky.find((z) => z.id === id)
  if (!zapisnik) throw new Error('Výlet nenalezen')

  return {
    ...zapisnik,
    lokalita: lokality.find((l) => l.id === zapisnik.lokalita_id)!,
    spatreni: spatreni
      .filter((s) => s.zapisnik_id === id)
      .sort((a, b) => a.cas_pozorovani.localeCompare(b.cas_pozorovani))
      .map((s) => ({ ...s, ptak: ptaky.find((d) => d.id === s.ptak_id)! })),
  }
}

export async function getPtaky(q = ''): Promise<Ptaka[]> {
  await latency(150)
  const hledane = q.trim().toLowerCase()
  return ptaky.filter(
    (d) =>
      d.nazev_cz.toLowerCase().includes(hledane) ||
      d.nazev_lat.toLowerCase().includes(hledane),
  )
}

export async function getPtak(id: UUID): Promise<PtakaDetail> {
  await latency()
  const druh = ptaky.find((d) => d.id === id)
  if (!druh) throw new Error('Druh nenalezen')

  return {
    ...druh,
    typ_ptaka: typyPtaku.find((t) => t.id === druh.typ_ptaka_id)!,
  }
}

export async function getHnizdiciPtak(mesic = new Date().getMonth() + 1,): Promise<Ptaka[]> {
  await latency(150)
  return ptaky.filter((d) =>
    d.hnizdi_od_mesic <= d.hnizdi_do_mesic
      ? mesic >= d.hnizdi_od_mesic && mesic <= d.hnizdi_do_mesic
      : mesic >= d.hnizdi_od_mesic || mesic <= d.hnizdi_do_mesic,
  )
}

export async function getLokality(): Promise<Lokalita[]>{
  await latency(100)
  return lokality
}

function ulozSpatreni(zapisnik_id: UUID, radky: SpatreniInput[]){
  for(let i = spatreni.length; i>=0; i--){
    if(spatreni[i].zapisnik_id === zapisnik_id){
        spatreni.splice(i, 1)
    }
  }

  radky.forEach((r) =>
    spatreni.push({ id: crypto.randomUUID(), zapisnik_id, ...r }),
  )
}

export async function createZapisnik(input: ZapisnikInput): Promise<ZapisnikDetail>{
  await latency()
  const { spatreni: radky, ...data } = input
  const novy: Zapisnik = { id: crypto.randomUUID(), user_id: USER_ID, ...data }
  zapisniky.push(novy)
  ulozSpatreni(novy.id, radky)
  return getZapisnik(novy.id)
}

export async function updateZapisnik(id: UUID, input: ZapisnikInput,): Promise<ZapisnikDetail>{
  await latency()
  const zapisnik = zapisniky.find((z) => z.id = id)
  if(!zapisnik) throw new Error('Výlet nenalezen')
  const { spatreni: radky, ...data } = input
  Object.assign(zapisnik, data)
  ulozSpatreni(id, radky)
  return getZapisnik(id)
}

export async function deleteZapisnik(id: UUID): Promise<void> {
  await latency()
  const index = zapisniky.findIndex((z) => z.id === id)
  if (index === -1) throw new Error('Výlet nenalezen')
  zapisniky.splice(index, 1)
  ulozSpatreni(id, [])
}