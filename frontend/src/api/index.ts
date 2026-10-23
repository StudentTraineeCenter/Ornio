import { druhy, lokality, spatreni, typyPtaku, zapisniky } from '../mocks/data'
import type {
  Ptaka,
  PtakaDetail,
  UUID,
  ZapisnikDetail,
  ZapisnikSeznam,
} from '../types'

// Simulace zpoždění sítě, ať vidíme načítání
const zpozdeni = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getZapisniky(): Promise<ZapisnikSeznam[]> {
  await zpozdeni()
  return zapisniky
    .map((z) => ({
      ...z,
      lokalita: lokality.find((l) => l.id === z.lokalita_id)!,
    }))
    .sort((a, b) => b.cas_od.localeCompare(a.cas_od))
}

export async function getZapisnik(id: UUID): Promise<ZapisnikDetail> {
  await zpozdeni()
  const zapisnik = zapisniky.find((z) => z.id === id)
  if (!zapisnik) throw new Error('Výlet nenalezen')

  return {
    ...zapisnik,
    lokalita: lokality.find((l) => l.id === zapisnik.lokalita_id)!,
    spatreni: spatreni
      .filter((s) => s.zapisnik_id === id)
      .sort((a, b) => a.cas_pozorovani.localeCompare(b.cas_pozorovani))
      .map((s) => ({ ...s, ptak: druhy.find((d) => d.id === s.ptak_id)! })),
  }
}

export async function getDruhy(q = ''): Promise<Ptaka[]> {
  await zpozdeni(150)
  const hledane = q.trim().toLowerCase()
  return druhy.filter(
    (d) =>
      d.nazev_cz.toLowerCase().includes(hledane) ||
      d.nazev_lat.toLowerCase().includes(hledane),
  )
}

export async function getDruh(id: UUID): Promise<PtakaDetail> {
  await zpozdeni()
  const druh = druhy.find((d) => d.id === id)
  if (!druh) throw new Error('Druh nenalezen')

  return {
    ...druh,
    typ_ptaka: typyPtaku.find((t) => t.id === druh.typ_ptaka_id)!,
  }
}

export async function getHnizdiciDruhy(
  mesic = new Date().getMonth() + 1,
): Promise<Ptaka[]> {
  await zpozdeni(150)
  return druhy.filter((d) =>
    d.hnizdi_od_mesic <= d.hnizdi_do_mesic
      ? mesic >= d.hnizdi_od_mesic && mesic <= d.hnizdi_do_mesic
      : mesic >= d.hnizdi_od_mesic || mesic <= d.hnizdi_do_mesic,
  )
}