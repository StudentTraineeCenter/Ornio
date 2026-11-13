-- =====================================================================
-- SEED DATA pro databazi ptacich zapisniku
-- Spustit AZ PO vytvoreni schematu. Poradi je dulezite (cizi klice).
--   users 23 | lokality 23 | typy_ptaku 24 | ptaky 27
--   zapisniky 24 | zapisnik_ptaky ~105 | statistiky_ptaku 27 (vytvori trigger)
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1) USERS (23)  - hashe jsou jen vyplnove, s timto seedem se nelze prihlasit
-- ---------------------------------------------------------------------
INSERT INTO users (username, email, password_hash, created_at)
SELECT
    t.u,
    t.u || '@example.cz',
    '$2b$12$' || md5(t.u) || substr(md5(t.u || 'x'), 1, 21),
    timestamptz '2025-09-01 10:00 Europe/Prague' + (t.n * 9) * interval '1 day'
FROM unnest(ARRAY[
    'jan.novak', 'petra.svobodova', 'tomas.dvorak', 'eva.cerna',
    'martin.prochazka', 'lucie.kucerova', 'ondrej.vesely', 'katerina.horakova',
    'jakub.nemec', 'hana.marekova', 'david.pospisil', 'michaela.hajkova',
    'filip.kral', 'anna.jelinkova', 'vojtech.zeman', 'tereza.ruzickova',
    'adam.benes', 'klara.fialova', 'lukas.sedlacek', 'nikola.dolezalova',
    'matej.kolar', 'sabina.navratilova', 'radek.kopecky'
]) WITH ORDINALITY AS t(u, n);

-- ---------------------------------------------------------------------
-- 2) LOKALITY (23) - souradnice jsou priblizne
-- ---------------------------------------------------------------------
INSERT INTO lokality (nazev, okres, gps_lat, gps_lon, typ_biotopu) VALUES
('Rybník Rožmberk',                 'Jindřichův Hradec', 48.9890, 14.7600, 'rybník'),
('Rybník Svět',                     'Jindřichův Hradec', 49.0035, 14.7670, 'rybník'),
('Lednické rybníky',                'Břeclav',           48.7970, 16.8050, 'rybník a lužní les'),
('NPR Pálava',                      'Břeclav',           48.8700, 16.6700, 'skalní step'),
('Soutok Moravy a Dyje',            'Břeclav',           48.6200, 16.9400, 'lužní les'),
('Boubínský prales',                'Prachatice',        48.9967, 13.8208, 'horský smrkový les'),
('Labská louka',                    'Trutnov',           50.7667, 15.5167, 'horská louka a klečové porosty'),
('Rašeliniště Boží Dar',            'Karlovy Vary',      50.4100, 12.9200, 'rašeliniště'),
('NPR Soos',                        'Cheb',              50.1472, 12.4106, 'rašeliniště a slaniska'),
('Lázeňský park Františkovy Lázně', 'Cheb',              50.1210, 12.3530, 'park'),
('NP Podyjí',                       'Znojmo',            48.8700, 15.9800, 'listnatý les a říční údolí'),
('Praděd',                          'Bruntál',           50.0833, 17.2306, 'horská hole'),
('Poodří',                          'Nový Jičín',        49.7000, 18.0500, 'říční niva a rybníky'),
('Hostýnské vrchy',                 'Kroměříž',          49.4500, 17.7000, 'bukový les'),
('Divoká Šárka',                    'Hlavní město Praha',50.1000, 14.3200, 'skalnaté údolí a listnatý les'),
('Brněnská přehrada',               'Brno-město',        49.2450, 16.5150, 'vodní nádrž'),
('Bolevecké rybníky',               'Plzeň-město',       49.7700, 13.3660, 'rybník'),
('Prachovské skály',                'Jičín',             50.4900, 15.2500, 'pískovcové skály a les'),
('Křivoklátsko',                    'Rakovník',          50.0380, 13.8670, 'dubohabřina'),
('Máchovo jezero',                  'Česká Lípa',        50.5700, 14.6500, 'jezero a borový les'),
('Lipno',                           'Český Krumlov',     48.6300, 14.2200, 'přehradní nádrž'),
('Šerlich',                         'Rychnov nad Kněžnou',50.3200, 16.4000, 'horský smrkový les'),
('Blanský les',                     'Český Krumlov',     48.8500, 14.3500, 'smíšený les');

-- ---------------------------------------------------------------------
-- 3) TYPY_PTAKU (24)
-- ---------------------------------------------------------------------
INSERT INTO typy_ptaku (nazev) VALUES
('Potápky'), ('Veslonozí'), ('Volavky'), ('Čápi'), ('Kachny'),
('Labutě a husy'), ('Dravci'), ('Sokoli'), ('Hrabavé'), ('Chřástalovití'),
('Bahňáci'), ('Rackovití'), ('Holubi'), ('Kukačky'), ('Sovy'),
('Rorýsi'), ('Ledňáčci'), ('Šplhavci'), ('Krkavcovití'), ('Sýkory'),
('Drozdovití'), ('Pěnkavovití'), ('Strnadi'), ('Vlaštovkovití');

-- ---------------------------------------------------------------------
-- 4) PTAKY (27) - trigger automaticky vytvori radek ve statistiky_ptaku
-- ---------------------------------------------------------------------
INSERT INTO ptaky (typ_ptaka_id, nazev_cz, nazev_lat, jak_poznat, rozsireni, potrava, hnizdi_od_mesic, hnizdi_do_mesic)
SELECT t.id, v.cz, v.lat, v.poznat, v.rozsireni, v.potrava, v.od, v.do_
FROM (VALUES
('Potápky', 'Potápka roháč', 'Podiceps cristatus',
 'Štíhlý bílý krk, v době toků dvojitý tmavý roh na hlavě a rezavý límec kolem hlavy. Při nebezpečí se potápí.',
 'Hnízdí na větších rybnících a nádržích s rákosím po celé ČR, v zimě zůstává na nezamrzlých vodách.',
 'Ryby, vodní hmyz, měkkýši.', 4, 8),
('Veslonozí', 'Kormorán velký', 'Phalacrocorax carbo',
 'Velký černý vodní pták s dlouhým zobákem zakončeným háčkem. Po plavání sedí s rozpjatými křídly, aby oschla.',
 'Hnízdí v koloniích na stromech u velkých vod, hlavně v jižních Čechách a na jižní Moravě; v zimě je hojný na řekách a nádržích.',
 'Ryby, které loví potápěním.', 3, 7),
('Volavky', 'Volavka popelavá', 'Ardea cinerea',
 'Velký šedý pták s dlouhýma nohama a černým pruhem nad okem. V letu má krk stažený do tvaru písmene S.',
 'Celá ČR, hnízdí v koloniích na vysokých stromech poblíž rybníků a řek.',
 'Ryby, žáby, hraboši, vodní hmyz.', 3, 7),
('Čápi', 'Čáp bílý', 'Ciconia ciconia',
 'Bílý pták s černými letkami, dlouhým červeným zobákem a červenýma nohama. Klape zobákem.',
 'Hnízdí na komínech, sloupech a stromech ve vesnicích, nejhojněji na jižní Moravě a v jižních Čechách; zimuje v Africe.',
 'Žáby, hraboši, velký hmyz, žížaly.', 4, 8),
('Kachny', 'Kachna divoká', 'Anas platyrhynchos',
 'Samec má zelenou hlavu, bílý obojek a hnědá prsa, samice je hnědě skvrnitá. Obě mají modré zrcátko na křídle.',
 'Nejhojnější kachna ČR, žije na všech typech vod včetně městských.',
 'Semena, vodní rostliny, vodní bezobratlí.', 3, 7),
('Labutě a husy', 'Labuť velká', 'Cygnus olor',
 'Celobílý velký pták s esovitě prohnutým krkem a oranžovým zobákem s černým knoflíkem u kořene.',
 'Hnízdí na rybnících, přehradách a řekách po celé ČR, v zimě se shromažďuje na nezamrzlých vodách.',
 'Vodní rostliny, tráva, řasy.', 3, 7),
('Dravci', 'Káně lesní', 'Buteo buteo',
 'Středně velký dravec se širokými křídly a krátkým ocasem, zbarvení velmi proměnlivé, většinou hnědé. Kroužení doprovází mňoukavé volání.',
 'Nejběžnější dravec ČR, žije v lesích s okolními poli a loukami.',
 'Hraboši, myši, mršiny, žížaly.', 3, 7),
('Dravci', 'Orel mořský', 'Haliaeetus albicilla',
 'Největší dravec ČR, rozpětí křídel až 2,5 m, křídla jako prkno, u dospělých bílý klínovitý ocas a žlutý zobák.',
 'Hnízdí na Třeboňsku, jižní Moravě, v Polabí a dalších oblastech s rybníky; v zimě se objevuje i jinde.',
 'Ryby, vodní ptáci, mršiny.', 2, 7),
('Sokoli', 'Poštolka obecná', 'Falco tinnunculus',
 'Menší sokol, rezavě hnědá s tmavými skvrnami, samec má šedou hlavu a ocas. Při lovu se třepetá na místě.',
 'Celá ČR, hnízdí na budovách ve městech, na skalách i v opuštěných hnízdech vran.',
 'Hraboši, myši, velký hmyz, ještěrky.', 4, 7),
('Hrabavé', 'Bažant obecný', 'Phasianus colchicus',
 'Samec je pestře zbarvený s tmavě zelenou hlavou, červenou lícní kůží a dlouhým ocasem, samice je hnědě skvrnitá.',
 'Zavlečený druh, hnízdí na polích a v křovinách, hojný v nížinách.',
 'Semena, zrní, hmyz, zelené části rostlin.', 4, 8),
('Chřástalovití', 'Lyska černá', 'Fulica atra',
 'Černý vodní pták s bílým štítkem na čele a bílým zobákem; prsty mají laloky.',
 'Rybníky a nádrže s rákosím po celé ČR, v zimě na nezamrzlých vodách.',
 'Vodní rostliny, řasy, drobní bezobratlí.', 4, 8),
('Bahňáci', 'Čejka chocholatá', 'Vanellus vanellus',
 'Černobílý bahňák s dlouhou tenkou chocholkou a širokými zaoblenými křídly. Ozývá se hlasitým čiju-vit.',
 'Hnízdí na vlhkých loukách, polích a březích rybníků, její početnost ale klesá.',
 'Žížaly, larvy, brouci a další drobní bezobratlí.', 3, 6),
('Rackovití', 'Racek chechtavý', 'Chroicocephalus ridibundus',
 'Menší racek, v létě s čokoládově hnědou hlavou a červeným zobákem, v zimě jen tmavá skvrna za okem. Hlas připomíná smích.',
 'Hnízdí v koloniích na rybnících, v zimě je hojný ve městech a u vod.',
 'Hmyz, žížaly, drobné ryby, odpadky.', 4, 7),
('Holubi', 'Holub hřivnáč', 'Columba palumbus',
 'Největší divoký holub, na krku bílá skvrna, na křídle bílý pruh. Hlas je opakované dlouhé hrkání.',
 'Lesy, parky a zemědělská krajina po celé ČR.',
 'Semena, zrní, pupeny, plody.', 3, 9),
('Kukačky', 'Kukačka obecná', 'Cuculus canorus',
 'Šedá, spodina příčně pruhovaná, hlas ku-ku zná každý. Samice klade vejce do hnízd jiných ptáků.',
 'Prakticky celá ČR od nížin po hory, zimuje v Africe.',
 'Chlupaté housenky a další hmyz.', 5, 7),
('Sovy', 'Puštík obecný', 'Strix aluco',
 'Středně velká hnědá sova s velkou kulatou hlavou, bez ušních chocholů, s tmavýma očima. Samec houká hú-hú-húúú.',
 'Lesy, parky a hřbitovy po celé ČR.',
 'Drobní savci, ptáci, hmyz.', 2, 6),
('Rorýsi', 'Rorýs obecný', 'Apus apus',
 'Tmavý pták s dlouhými srpovitými křídly a krátkým vidličnatým ocasem, hlasité vřeštění. Většinu života tráví ve vzduchu.',
 'Hnízdí ve městech ve štěrbinách budov, zimuje v Africe.',
 'Létající hmyz a drobní pavouci.', 5, 8),
('Ledňáčci', 'Ledňáček říční', 'Alcedo atthis',
 'Malý pták s modrozelenými zády, oranžovou spodinou a dlouhým zobákem. Často ho zahlédneme jen jako modrý záblesk nad vodou.',
 'Hnízdí v norách v hliněných březích čistých řek a rybníků po celé ČR.',
 'Drobné ryby, vodní hmyz.', 4, 8),
('Šplhavci', 'Datel černý', 'Dryocopus martius',
 'Největší datel, celý černý, s červenou čepicí (samice jen na zátylku) a světlým zobákem. Hlasitě volá a bubnuje.',
 'Staré jehličnaté a smíšené lesy po celé ČR.',
 'Larvy dřevokazného hmyzu, mravenci.', 3, 6),
('Šplhavci', 'Strakapoud velký', 'Dendrocopos major',
 'Černobílý datel s červeným podocasem, samec má červenou skvrnu v týle. Hlasitě bubnuje.',
 'Nejhojnější datel ČR, v lesích, parcích i zahradách.',
 'Larvy hmyzu, semena smrku a borovice, v zimě i ořechy.', 3, 6),
('Krkavcovití', 'Straka obecná', 'Pica pica',
 'Černobílá s dlouhým klínovitým ocasem a kovovým leskem. Hlas je chrchlavé kekekeke.',
 'Vesnice, města i zemědělská krajina, hnízdo staví v koruně stromu.',
 'Hmyz, drobní živočichové, semena, vejce, odpadky.', 3, 6),
('Sýkory', 'Sýkora koňadra', 'Parus major',
 'Černá hlava s bílými líčky, žlutá spodina s černým pruhem uprostřed. Zpěv zní jako cinu-cinu.',
 'Lesy, parky, zahrady, ráda hnízdí v budkách; u nás žije celoročně.',
 'Hmyz, pavouci, semena, v zimě slunečnice a lůj.', 4, 7),
('Drozdovití', 'Kos černý', 'Turdus merula',
 'Samec je černý se žlutooranžovým zobákem a očním kroužkem, samice tmavě hnědá. Zpěv je melodický a flétnový.',
 'Lesy, parky, zahrady i města, nejhojnější drozd ČR.',
 'Žížaly, hmyz, bobule, ovoce.', 3, 8),
('Drozdovití', 'Červenka obecná', 'Erithacus rubecula',
 'Oranžově rudé hrdlo a prsa, hnědá záda, velké tmavé oči. Zpívá i v zimě.',
 'Lesy, parky a zahrady po celé ČR.',
 'Hmyz, pavouci, bobule.', 4, 7),
('Pěnkavovití', 'Pěnkava obecná', 'Fringilla coelebs',
 'Samec má šedomodrou čepičku, růžovohnědá prsa a dva bílé pruhy na křídle. Zpěv je klesající trylek zakončený cvaknutím.',
 'Jeden z nejhojnějších ptáků ČR, žije v lesích, parcích i zahradách.',
 'Semena, v době hnízdění hmyz.', 4, 7),
('Strnadi', 'Strnad obecný', 'Emberiza citrinella',
 'Samec má sytě žlutou hlavu a spodinu těla a rezavý kostřec. Zpěv se lidově přepisuje jako bez sýýýra.',
 'Otevřená krajina s keři a remízky po celé ČR.',
 'Semena, v době hnízdění hmyz.', 4, 8),
('Vlaštovkovití', 'Vlaštovka obecná', 'Hirundo rustica',
 'Modročerná svrchu, rezavé čelo a hrdlo, dlouhé vidličnaté ocasní pera. Hnízdo z bláta lepí pod střechy.',
 'Vesnice a farmy po celé ČR, zimuje v Africe.',
 'Létající hmyz.', 4, 9)
) AS v(typ, cz, lat, poznat, rozsireni, potrava, od, do_)
JOIN typy_ptaku t ON t.nazev = v.typ;

-- ---------------------------------------------------------------------
-- 5) ZAPISNIKY (24)
-- ---------------------------------------------------------------------
INSERT INTO zapisniky (id, user_id, lokalita_id, nazev, cas_od, cas_do, poznamky, viditelnost)
SELECT
    ('b0000000-0000-0000-0000-' || lpad(v.n::text, 12, '0'))::uuid,
    u.id,
    l.id,
    v.nazev,
    v.od::timestamptz,
    v.od::timestamptz + v.hodin * interval '1 hour',
    v.poznamky,
    v.vid
FROM (VALUES
( 1, 'jan.novak',          'Rybník Rožmberk',                 'Jarní tah na Rožmberku',        '2026-03-28 07:00 Europe/Prague', 4, 'Jasno, slabý vítr, výborná viditelnost.',          'verejny'),
( 2, 'petra.svobodova',    'Rybník Svět',                     'Třeboňsko po ránu',             '2026-04-12 06:30 Europe/Prague', 3, 'Mlha se zvedla kolem osmé hodiny.',                'pratele'),
( 3, 'tomas.dvorak',       'Lednické rybníky',                'Lednice - vodní ptáci',         '2026-04-19 08:00 Europe/Prague', 4, 'Hodně ptáků na hnízdech, příjemné počasí.',        'verejny'),
( 4, 'eva.cerna',          'NPR Pálava',                      'Pálava a step',                 '2026-05-03 09:00 Europe/Prague', 3, 'Teplo, silný vítr na vrcholu.',                    'verejny'),
( 5, 'martin.prochazka',   'Soutok Moravy a Dyje',            'Lužní les na Soutoku',          '2026-05-10 05:30 Europe/Prague', 4, 'Brzký výjezd na kole, hodně komárů.',              'soukromy'),
( 6, 'lucie.kucerova',     'Boubínský prales',                'Boubín - prales',               '2026-05-17 07:00 Europe/Prague', 4, 'Chladno, v lese ještě zbytky sněhu.',              'pratele'),
( 7, 'ondrej.vesely',      'Labská louka',                    'Krkonoše - Labská louka',       '2026-06-06 08:00 Europe/Prague', 3, 'Polojasno, výhledy do údolí.',                     'verejny'),
( 8, 'katerina.horakova',  'Rašeliniště Boží Dar',            'Rašeliniště na Božím Daru',     '2026-06-13 07:30 Europe/Prague', 3, 'Po ránu zima, odpoledne slunečno.',                'pratele'),
( 9, 'jakub.nemec',        'NPR Soos',                        'Soos - jarní ráno',             '2026-04-26 06:00 Europe/Prague', 3, 'Slaniska plná života, skvělé světlo.',             'verejny'),
(10, 'hana.marekova',      'Lázeňský park Františkovy Lázně', 'Procházka lázeňským parkem',    '2026-04-05 07:30 Europe/Prague', 2, 'Krátká procházka před snídaní.',                   'soukromy'),
(11, 'david.pospisil',     'NP Podyjí',                       'Podyjí - údolí Dyje',           '2026-05-24 06:00 Europe/Prague', 4, 'Dlouhá túra, výborný zpěv ptáků.',                 'verejny'),
(12, 'michaela.hajkova',   'Praděd',                          'Hrubý Jeseník - Praděd',        '2026-07-04 09:00 Europe/Prague', 3, 'Větrno, na hřebenu zataženo.',                     'pratele'),
(13, 'filip.kral',         'Poodří',                          'Poodří - letní pozorování',     '2026-08-15 06:30 Europe/Prague', 4, 'Horko, nejvíc ptáků u vody.',                      'verejny'),
(14, 'anna.jelinkova',     'Hostýnské vrchy',                 'Hostýn - bukový les',           '2026-09-06 08:00 Europe/Prague', 3, 'Klidný den, ptáci se již shlukují do hejn.',       'pratele'),
(15, 'vojtech.zeman',      'Divoká Šárka',                    'Divoká Šárka v březnu',         '2026-03-15 07:00 Europe/Prague', 2, 'První jarní zpěv.',                                'verejny'),
(16, 'tereza.ruzickova',   'Brněnská přehrada',               'Brněnská přehrada na podzim',   '2026-10-04 08:30 Europe/Prague', 3, 'Oblačno, hodně vodních ptáků.',                    'verejny'),
(17, 'adam.benes',         'Bolevecké rybníky',               'Plzeň - Bolevec',               '2026-10-11 09:00 Europe/Prague', 2, 'Krátká zastávka s dalekohledem.',                  'soukromy'),
(18, 'klara.fialova',      'Prachovské skály',                'Prachovské skály',              '2026-09-20 08:00 Europe/Prague', 3, 'Slunečno, na stezkách hodně turistů.',             'pratele'),
(19, 'lukas.sedlacek',     'Křivoklátsko',                    'Křivoklátsko za svítání',       '2026-05-31 05:30 Europe/Prague', 4, 'Nejlepší zpěv těsně po východu slunce.',           'verejny'),
(20, 'nikola.dolezalova',  'Máchovo jezero',                  'Máchovo jezero v létě',         '2026-08-02 07:00 Europe/Prague', 3, 'Brzy ráno klid, později plno lidí.',               'pratele'),
(21, 'matej.kolar',        'Lipno',                           'Lipno - podzimní tah',          '2026-10-18 08:00 Europe/Prague', 3, 'Studený vítr od vody.',                            'verejny'),
(22, 'sabina.navratilova', 'Šerlich',                         'Orlické hory - Šerlich',        '2026-07-18 08:00 Europe/Prague', 3, 'Mlhavo, viditelnost se zlepšila až v poledne.',    'soukromy'),
(23, 'radek.kopecky',      'Blanský les',                     'Blanský les - letní ráno',      '2026-06-20 06:00 Europe/Prague', 3, 'Teplo, ptáci aktivní hlavně do osmi.',             'verejny'),
(24, 'jan.novak',          'Rybník Svět',                     'Svět - podzimní kontrola',      '2026-10-24 07:30 Europe/Prague', 3, 'Poslední odlétající ptáci, chladné ráno.',         'pratele')
) AS v(n, username, lokalita, nazev, od, hodin, poznamky, vid)
JOIN users u    ON u.username = v.username
JOIN lokality l ON l.nazev    = v.lokalita;

-- ---------------------------------------------------------------------
-- 6) ZAPISNIK_PTAKY (~105 pozorovani)
--    cas_pozorovani = zacatek zapisniku + pocet minut (vzdy v ramci zapisniku)
--    Triggery pri kazdem radku samy prepocitaji statistiky_ptaku.
-- ---------------------------------------------------------------------
INSERT INTO zapisnik_ptaky (zapisnik_id, ptak_id, chovani, cas_pozorovani, poznamka)
SELECT
    z.id,
    p.id,
    v.chovani,
    z.cas_od + v.minuty * interval '1 minute',
    v.poznamka
FROM (VALUES
-- 1  Rozmberk
( 1, 'Kormorán velký',      'odpočívá na kůlech',          15,  'Asi 40 kusů v řadě.'),
( 1, 'Labuť velká',         'plave v páru',                40,  ''),
( 1, 'Orel mořský',         'krouží nad hladinou',         70,  'Dospělý jedinec.'),
( 1, 'Volavka popelavá',    'loví v mělčině',              95,  ''),
( 1, 'Racek chechtavý',     'hnízdní kolonie',            150,  'Hlasitá kolonie na ostrůvku.'),
-- 2  Svet
( 2, 'Kachna divoká',       'plave v hejnu',               10,  ''),
( 2, 'Lyska černá',         'staví hnízdo',                35,  ''),
( 2, 'Potápka roháč',       'toky',                        60,  'Nádherný svatební tanec.'),
( 2, 'Ledňáček říční',      'lov z větve',                120,  'Jen krátce, odletěl.'),
-- 3  Lednice
( 3, 'Čáp bílý',            'sedí na hnízdě',              20,  ''),
( 3, 'Labuť velká',         'sedí na hnízdě',              45,  ''),
( 3, 'Potápka roháč',       'toky',                        80,  ''),
( 3, 'Lyska černá',         'hájí teritorium',            110,  ''),
( 3, 'Čejka chocholatá',    'tokací let',                 170,  ''),
-- 4  Palava
( 4, 'Poštolka obecná',     'třepetá se nad stepí',        15,  ''),
( 4, 'Strnad obecný',       'zpívá na keři',               50,  ''),
( 4, 'Káně lesní',          'krouží v termice',            90,  ''),
( 4, 'Kukačka obecná',      'volá z lesíka',              130,  ''),
-- 5  Soutok
( 5, 'Puštík obecný',       'houká ještě za šera',          5,  'Slyšen, neviděn.'),
( 5, 'Červenka obecná',     'zpívá',                       30,  ''),
( 5, 'Datel černý',         'ozývá se v lese',             60,  ''),
( 5, 'Holub hřivnáč',       'tokání',                     100,  ''),
( 5, 'Káně lesní',          'sedí na stromě',             150,  ''),
( 5, 'Kukačka obecná',      'volá',                       200,  ''),
-- 6  Boubin
( 6, 'Datel černý',         'vyklepává dutinu',            25,  'Čerstvá dutina v buku.'),
( 6, 'Sýkora koňadra',      'v hejnu s dalšími sýkorami',  70,  ''),
( 6, 'Strakapoud velký',    'šplhá po kmeni',             110,  ''),
( 6, 'Červenka obecná',     'zpívá',                      180,  ''),
-- 7  Labska louka
( 7, 'Poštolka obecná',     'loví nad loukou',             30,  ''),
( 7, 'Pěnkava obecná',      'zpívá v kleči',               60,  ''),
( 7, 'Káně lesní',          'krouží',                     100,  ''),
( 7, 'Kukačka obecná',      'volá',                       150,  ''),
-- 8  Bozi Dar
( 8, 'Káně lesní',          'sedí na smrku',               20,  ''),
( 8, 'Pěnkava obecná',      'zpívá',                       50,  ''),
( 8, 'Kos černý',           'hledá potravu',               85,  ''),
( 8, 'Strnad obecný',       'zpívá na keři',              130,  ''),
-- 9  Soos
( 9, 'Čejka chocholatá',    'tokací let',                  20,  ''),
( 9, 'Poštolka obecná',     'loví myši',                   55,  ''),
( 9, 'Strnad obecný',       'zpívá',                       90,  ''),
( 9, 'Kachna divoká',       'brodí se v mělčině',         130,  ''),
( 9, 'Bažant obecný',       'ozývá se na poli',           150,  ''),
-- 10 Frantiskovy Lazne
(10, 'Sýkora koňadra',      'zpívá',                        5,  ''),
(10, 'Kos černý',           'zpívá',                       20,  ''),
(10, 'Strakapoud velký',    'bubnuje',                     45,  ''),
(10, 'Pěnkava obecná',      'zpívá',                       70,  ''),
(10, 'Holub hřivnáč',       'sedí v koruně stromu',       100,  ''),
(10, 'Straka obecná',       'prochází trávník',           110,  ''),
-- 11 Podyji
(11, 'Puštík obecný',       'houká',                        5,  ''),
(11, 'Datel černý',         'ozývá se',                    30,  ''),
(11, 'Strakapoud velký',    'šplhá po kmeni',              90,  ''),
(11, 'Červenka obecná',     'zpívá',                      150,  ''),
(11, 'Poštolka obecná',     'sedí na skále',              210,  ''),
-- 12 Praded
(12, 'Kos černý',           'zpívá',                       25,  ''),
(12, 'Poštolka obecná',     'loví',                        80,  ''),
(12, 'Káně lesní',          'krouží',                     100,  ''),
(12, 'Pěnkava obecná',      'zpívá',                      120,  ''),
-- 13 Poodri
(13, 'Čáp bílý',            'loví na louce',               20,  ''),
(13, 'Volavka popelavá',    'stojí u vody',                55,  ''),
(13, 'Ledňáček říční',      'rychlý přelet nad vodou',     90,  ''),
(13, 'Lyska černá',         'plave s mláďaty',            140,  ''),
(13, 'Kachna divoká',       'koupe se',                   180,  ''),
(13, 'Vlaštovka obecná',    'loví nad hladinou',          210,  ''),
-- 14 Hostynske vrchy
(14, 'Datel černý',         'ozývá se',                    30,  ''),
(14, 'Strakapoud velký',    'šplhá po kmeni',              70,  ''),
(14, 'Sýkora koňadra',      'v hejnu',                    105,  ''),
(14, 'Červenka obecná',     'tiše tiká v křoví',          140,  ''),
-- 15 Divoka Sarka
(15, 'Strakapoud velký',    'bubnuje',                     10,  ''),
(15, 'Sýkora koňadra',      'zpívá',                       25,  ''),
(15, 'Kos černý',           'zpívá',                       40,  ''),
(15, 'Pěnkava obecná',      'zpívá',                       65,  ''),
(15, 'Straka obecná',       'staví hnízdo',               100,  ''),
-- 16 Brnenska prehrada
(16, 'Kormorán velký',      'odpočívá',                    20,  ''),
(16, 'Racek chechtavý',     'sedí na hladině',             40,  'Už v zimním šatu.'),
(16, 'Labuť velká',         'plave',                       70,  ''),
(16, 'Potápka roháč',       'potápí se',                  100,  ''),
(16, 'Kachna divoká',       'hejno u břehu',              150,  ''),
-- 17 Bolevecke rybniky
(17, 'Lyska černá',         've větší skupině',            10,  ''),
(17, 'Kachna divoká',       'krmena lidmi',                30,  ''),
(17, 'Labuť velká',         'plave',                       50,  ''),
(17, 'Racek chechtavý',     'sedí na zábradlí',            75,  ''),
(17, 'Volavka popelavá',    'stojí na břehu',             100,  ''),
-- 18 Prachovske skaly
(18, 'Datel černý',         'ozývá se',                    40,  ''),
(18, 'Káně lesní',          'krouží nad skalami',          80,  ''),
(18, 'Sýkora koňadra',      'v hejnu',                    110,  ''),
(18, 'Červenka obecná',     'tiká',                       150,  ''),
-- 19 Krivoklatsko
(19, 'Puštík obecný',       'houká',                        5,  ''),
(19, 'Datel černý',         'ozývá se',                    20,  ''),
(19, 'Kukačka obecná',      'volá',                        70,  ''),
(19, 'Pěnkava obecná',      'zpívá',                      100,  ''),
(19, 'Strakapoud velký',    'bubnuje',                    130,  ''),
(19, 'Káně lesní',          'volá nad lesem',             200,  ''),
-- 20 Machovo jezero
(20, 'Racek chechtavý',     'sedí u pláže',                20,  ''),
(20, 'Rorýs obecný',        'loví nad hladinou',           45,  ''),
(20, 'Vlaštovka obecná',    'loví nad hladinou',           60,  ''),
(20, 'Potápka roháč',       'krmí mláďata',               100,  ''),
(20, 'Kachna divoká',       'hejno na vodě',              140,  ''),
-- 21 Lipno
(21, 'Kormorán velký',      'rybaří',                      15,  ''),
(21, 'Volavka popelavá',    'loví',                        60,  ''),
(21, 'Orel mořský',         'sedí na stromě',              95,  'Nezralý jedinec.'),
(21, 'Labuť velká',         'plave',                      130,  ''),
(21, 'Racek chechtavý',     'v hejnu',                    150,  ''),
-- 22 Serlich
(22, 'Strnad obecný',       'zpívá',                       25,  ''),
(22, 'Poštolka obecná',     'loví',                        60,  ''),
(22, 'Káně lesní',          'krouží',                      90,  ''),
(22, 'Pěnkava obecná',      'zpívá',                      130,  ''),
-- 23 Blansky les
(23, 'Datel černý',         'ozývá se',                    20,  ''),
(23, 'Strakapoud velký',    'šplhá po kmeni',              50,  ''),
(23, 'Sýkora koňadra',      'v hejnu',                     85,  ''),
(23, 'Kos černý',           'zpívá',                      110,  ''),
(23, 'Pěnkava obecná',      'zpívá',                      140,  ''),
-- 24 Svet - podzim
(24, 'Kormorán velký',      'tah',                         20,  ''),
(24, 'Labuť velká',         'plave',                       45,  ''),
(24, 'Orel mořský',         'sedí na stromě',              80,  ''),
(24, 'Lyska černá',         'plave',                      110,  ''),
(24, 'Kachna divoká',       'hejno',                      140,  '')
) AS v(n, ptak, chovani, minuty, poznamka)
JOIN zapisniky z ON z.id = ('b0000000-0000-0000-0000-' || lpad(v.n::text, 12, '0'))::uuid
JOIN ptaky p     ON p.nazev_cz = v.ptak;

-- ---------------------------------------------------------------------
-- 7) Jistota: prepocitat statistiky vsech ptaku
-- ---------------------------------------------------------------------
SELECT prepocitej_statistiku(id) FROM ptaky;

COMMIT;

-- ---------------------------------------------------------------------
-- Kontrola poctu radku (kazda tabulka >= 20)
-- ---------------------------------------------------------------------
SELECT 'users' AS tabulka, count(*) FROM users
UNION ALL SELECT 'lokality',         count(*) FROM lokality
UNION ALL SELECT 'typy_ptaku',       count(*) FROM typy_ptaku
UNION ALL SELECT 'ptaky',            count(*) FROM ptaky
UNION ALL SELECT 'zapisniky',        count(*) FROM zapisniky
UNION ALL SELECT 'zapisnik_ptaky',   count(*) FROM zapisnik_ptaky
UNION ALL SELECT 'statistiky_ptaku', count(*) FROM statistiky_ptaku;