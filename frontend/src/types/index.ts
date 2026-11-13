export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Viditelnost = 'soukromy' | 'pratele' | 'verejny'

// Tabulky z databaze

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

// Odpovedi API (data spojena pres JOIN v backend)

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

// Data odesilana z formulare

export interface SpatreniInput{
  ptak_id: UUID
  cas_pozorovani: string
  poznamka: string
}

export interface ZapisnikInput{
  nazev: string
  lokalita_id: UUID
  cas_od: string
  cas_do: string
  poznamky: string
  viditelnost: Viditelnost
  spatreni: SpatreniInput[]
}