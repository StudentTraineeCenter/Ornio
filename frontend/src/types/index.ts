export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Viditelnost = 'soukromy' | 'pratele' | 'verejny'

// ─── Tabulky z databáze ───────────────────────────────

export interface Typ_ptaka {
  id: UUID
  nazev: string
}

export interface Ptaka {
  id: UUID
  typ_ptaka_id: UUID
  nazev_cz: string
  nazev_lat: string
  jak_poznat: string
  rozsireni: string
  potrava: string
  hnizdi_od_mesic: number
  hnizdi_do_mesic: number
}

export interface Lokalita {
  id: UUID
  nazev: string
  okres: string
  gps_lat: number
  gps_lon: number
  typ_biotopu: string
}

export interface Zapisnik {
  id: UUID
  user_id: UUID
  lokalita_id: UUID
  nazev: string
  cas_od: string // ISO datum a čas
  cas_do: string
  poznamky: string
  viditelnost: Viditelnost
}

export interface Spatreni {
  id: UUID
  zapisnik_id: UUID
  ptak_id: UUID
  chovani: string
  cas_pozorovani: string
  poznamka: string
}

// ─── Odpovědi API (data spojená přes JOIN v backendu) ─

export interface ZapisnikSeznam extends Zapisnik {
  lokalita: Lokalita
}

export interface SpatreniSPtakem extends Spatreni {
  ptak: Ptaka
}

export interface ZapisnikDetail extends ZapisnikSeznam {
  spatreni: SpatreniSPtakem[]
}

export interface PtakaDetail extends Ptaka {
  typ_ptaka: Typ_ptaka
}