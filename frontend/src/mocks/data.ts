import type {
  Lokalita,
  Ptaka,
  Spatreni,
  Typ_ptaka,
  UUID,
  Zapisnik,
} from '../types'

// Pevná UUID pro testovací data, ať se po obnovení stránky nemění
const uuid = (n: number): UUID =>
  `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

// ─── Identifikátory (pro čitelnost níže) ──────────────

export const USER_ID = uuid(601)

const TYP = {
  vodni: uuid(11),
  dravci: uuid(12),
  pevci: uuid(13),
  splhavci: uuid(14),
  brodivi: uuid(15),
}

const DRUH = {
  rybak: uuid(21),
  cejka: uuid(22),
  lednacek: uuid(23),
  kos: uuid(24),
  kane: uuid(25),
  sykora: uuid(26),
  strakapoud: uuid(27),
  labut: uuid(28),
}

const LOK = {
  amerika: uuid(31),
  slavkovsky: uuid(32),
  orlice: uuid(33),
}

const ZAP = {
  amerika: uuid(41),
  slavkovsky: uuid(42),
  orlice: uuid(43),
}

// ─── Typy ptáků ───────────────────────────────────────

export const typyPtaku: Typ_ptaka[] = [
  { id: TYP.vodni, nazev: 'Vodní ptáci' },
  { id: TYP.dravci, nazev: 'Dravci' },
  { id: TYP.pevci, nazev: 'Pěvci' },
  { id: TYP.splhavci, nazev: 'Šplhavci' },
  { id: TYP.brodivi, nazev: 'Brodiví' },
]

// ─── Druhy (encyklopedie) ─────────────────────────────

export const druhy: Ptaka[] = [
  {
    id: DRUH.rybak,
    typ_ptaka_id: TYP.vodni,
    nazev_cz: 'Rybák obecný',
    nazev_lat: 'Sterna hirundo',
    jak_poznat:
      'Štíhlý bílošedý pták s černou čepičkou, červeným zobákem a hluboce vykrojeným ocasem.',
    rozsireni:
      'Hnízdí kolonielně na rybnících a štěrkových ostrovech, v Česku nepříliš hojný.',
    potrava: 'Drobné ryby, které loví střemhlavým ponorem.',
    hnizdi_od_mesic: 5,
    hnizdi_do_mesic: 7,
  },
  {
    id: DRUH.cejka,
    typ_ptaka_id: TYP.brodivi,
    nazev_cz: 'Čejka chocholatá',
    nazev_lat: 'Vanellus vanellus',
    jak_poznat:
      'Černobílý pták s výrazným chocholem na hlavě a zelenavým leskem na hřbetě.',
    rozsireni: 'Vlhké louky, pole a okraje rybníků po celém území.',
    potrava: 'Hmyz, žížaly a drobní bezobratlí.',
    hnizdi_od_mesic: 3,
    hnizdi_do_mesic: 6,
  },
  {
    id: DRUH.lednacek,
    typ_ptaka_id: TYP.pevci,
    nazev_cz: 'Ledňáček říční',
    nazev_lat: 'Alcedo atthis',
    jak_poznat:
      'Malý pták s tyrkysovým hřbetem, oranžovým bříškem a dlouhým zobákem.',
    rozsireni: 'Pomalu tekoucí vody a rybníky s hliněnými břehy.',
    potrava: 'Malé rybky a vodní hmyz.',
    hnizdi_od_mesic: 3,
    hnizdi_do_mesic: 8,
  },
  {
    id: DRUH.kos,
    typ_ptaka_id: TYP.pevci,
    nazev_cz: 'Kos černý',
    nazev_lat: 'Turdus merula',
    jak_poznat: 'Samec je celý černý s oranžovým zobákem, samice hnědá.',
    rozsireni: 'Lesy, parky a zahrady, v Česku velmi hojný.',
    potrava: 'Žížaly, hmyz a bobule.',
    hnizdi_od_mesic: 3,
    hnizdi_do_mesic: 8,
  },
  {
    id: DRUH.kane,
    typ_ptaka_id: TYP.dravci,
    nazev_cz: 'Káně lesní',
    nazev_lat: 'Buteo buteo',
    jak_poznat:
      'Středně velký dravec s široce rozpřaženými křídly, často krouží ve vzduchu.',
    rozsireni: 'Kulturní krajina střídající lesy a pole.',
    potrava: 'Drobní hlodavci, plazi a hmyz.',
    hnizdi_od_mesic: 3,
    hnizdi_do_mesic: 7,
  },
  {
    id: DRUH.sykora,
    typ_ptaka_id: TYP.pevci,
    nazev_cz: 'Sýkora koňadra',
    nazev_lat: 'Parus major',
    jak_poznat:
      'Černá hlava s bílými tvářemi a žlutá hruď s černým podélným pruhem.',
    rozsireni: 'Lesy, zahrady a parky, hnízdí i v budkách.',
    potrava: 'Hmyz, semena a v zimě slunečnice z krmítek.',
    hnizdi_od_mesic: 4,
    hnizdi_do_mesic: 6,
  },
  {
    id: DRUH.strakapoud,
    typ_ptaka_id: TYP.splhavci,
    nazev_cz: 'Strakapoud velký',
    nazev_lat: 'Dendrocopos major',
    jak_poznat:
      'Černobílý šplhavec s červeným podocasem, samec má červenou skvrnu na zátylku.',
    rozsireni: 'Listnaté i jehličnaté lesy a staré parky.',
    potrava: 'Larvy hmyzu z kůry stromů, semena šišek.',
    hnizdi_od_mesic: 4,
    hnizdi_do_mesic: 6,
  },
  {
    id: DRUH.labut,
    typ_ptaka_id: TYP.vodni,
    nazev_cz: 'Labuť velká',
    nazev_lat: 'Cygnus olor',
    jak_poznat:
      'Velký bílý vodní pták s ohnutým krkem a oranžovým zobákem s černým výrůstkem.',
    rozsireni: 'Rybníky, jezera a pomalé řeky.',
    potrava: 'Vodní rostliny, řasy a drobní vodní živočichové.',
    hnizdi_od_mesic: 3,
    hnizdi_do_mesic: 6,
  },
]

// ─── Lokality ─────────────────────────────────────────

export const lokality: Lokalita[] = [
  {
    id: LOK.amerika,
    nazev: 'Rybník Amerika',
    okres: 'Cheb',
    gps_lat: 50.07,
    gps_lon: 12.37,
    typ_biotopu: 'Rybník',
  },
  {
    id: LOK.slavkovsky,
    nazev: 'Slavkovský les',
    okres: 'Sokolov',
    gps_lat: 50.1,
    gps_lon: 12.7,
    typ_biotopu: 'Les',
  },
  {
    id: LOK.orlice,
    nazev: 'Údolí Divoké Orlice',
    okres: 'Ústí nad Orlicí',
    gps_lat: 50.0,
    gps_lon: 16.4,
    typ_biotopu: 'Řeka a luh',
  },
]

// ─── Zápisníky (výlety) ───────────────────────────────

export const zapisniky: Zapisnik[] = [
  {
    id: ZAP.amerika,
    user_id: USER_ID,
    lokalita_id: LOK.amerika,
    nazev: 'Ranní procházka u rybníka',
    cas_od: '2026-04-12T06:30:00',
    cas_do: '2026-04-12T09:15:00',
    poznamky:
      'Ráno mlha, po osmé se vyjasnilo. U rákosí bylo slyšet spoustu zpěvu.',
    viditelnost: 'soukromy',
  },
  {
    id: ZAP.slavkovsky,
    user_id: USER_ID,
    lokalita_id: LOK.slavkovsky,
    nazev: 'Víkend ve Slavkovském lese',
    cas_od: '2026-04-03T08:00:00',
    cas_do: '2026-04-03T12:30:00',
    poznamky: 'Chladno, ale slunečno. Strakapoud bubnoval na suchém kmeni.',
    viditelnost: 'pratele',
  },
  {
    id: ZAP.orlice,
    user_id: USER_ID,
    lokalita_id: LOK.orlice,
    nazev: 'Divoká Orlice po práci',
    cas_od: '2026-05-20T17:00:00',
    cas_do: '2026-05-20T19:30:00',
    poznamky: 'Podvečer u řeky, ledňáček přelétl dvakrát nad hladinou.',
    viditelnost: 'soukromy',
  },
]

// ─── Spatření ─────────────────────────────────────────

export const spatreni: Spatreni[] = [
  // Rybník Amerika
  {
    id: uuid(501),
    zapisnik_id: ZAP.amerika,
    ptak_id: DRUH.rybak,
    chovani: 'hnízdí',
    cas_pozorovani: '2026-04-12T07:10:00',
    poznamka: 'Kolonie na ostrůvku.',
  },
  {
    id: uuid(502),
    zapisnik_id: ZAP.amerika,
    ptak_id: DRUH.lednacek,
    chovani: 'krmí se',
    cas_pozorovani: '2026-04-12T07:45:00',
    poznamka: '',
  },
  {
    id: uuid(503),
    zapisnik_id: ZAP.amerika,
    ptak_id: DRUH.cejka,
    chovani: 'migruje',
    cas_pozorovani: '2026-04-12T07:50:00',
    poznamka: 'Hejno asi deseti kusů.',
  },
  {
    id: uuid(504),
    zapisnik_id: ZAP.amerika,
    ptak_id: DRUH.cejka,
    chovani: 'odpočívá',
    cas_pozorovani: '2026-04-12T08:40:00',
    poznamka: 'Na louce za hrází.',
  },

  // Slavkovský les
  {
    id: uuid(505),
    zapisnik_id: ZAP.slavkovsky,
    ptak_id: DRUH.strakapoud,
    chovani: 'bubnuje',
    cas_pozorovani: '2026-04-03T09:20:00',
    poznamka: '',
  },
  {
    id: uuid(506),
    zapisnik_id: ZAP.slavkovsky,
    ptak_id: DRUH.kos,
    chovani: 'zpívá',
    cas_pozorovani: '2026-04-03T10:05:00',
    poznamka: 'Samec na vrcholku smrku.',
  },
  {
    id: uuid(507),
    zapisnik_id: ZAP.slavkovsky,
    ptak_id: DRUH.kane,
    chovani: 'krouží',
    cas_pozorovani: '2026-04-03T11:15:00',
    poznamka: '',
  },

  // Divoká Orlice
  {
    id: uuid(508),
    zapisnik_id: ZAP.orlice,
    ptak_id: DRUH.lednacek,
    chovani: 'loví',
    cas_pozorovani: '2026-05-20T17:40:00',
    poznamka: '',
  },
  {
    id: uuid(509),
    zapisnik_id: ZAP.orlice,
    ptak_id: DRUH.lednacek,
    chovani: 'přelétá',
    cas_pozorovani: '2026-05-20T18:20:00',
    poznamka: 'Podruhé, proti proudu.',
  },
  {
    id: uuid(510),
    zapisnik_id: ZAP.orlice,
    ptak_id: DRUH.sykora,
    chovani: 'zpívá',
    cas_pozorovani: '2026-05-20T18:50:00',
    poznamka: '',
  },
]