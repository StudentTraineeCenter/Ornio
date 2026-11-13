CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username      varchar(50)  NOT NULL UNIQUE,
    email         varchar(255) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    created_at    timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE lokality (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nazev       varchar(150) NOT NULL,
    okres       varchar(100) NOT NULL DEFAULT '',
    gps_lat     double precision CHECK (gps_lat BETWEEN -90 AND 90),
    gps_lon     double precision CHECK (gps_lon BETWEEN -180 AND 180),
    typ_biotopu varchar(100) NOT NULL DEFAULT ''
);

CREATE TABLE typy_ptaku (
    id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nazev varchar(100) NOT NULL UNIQUE
);

CREATE TABLE ptaky (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    typ_ptaka_id    uuid NOT NULL REFERENCES typy_ptaku(id),
    nazev_cz        varchar(150) NOT NULL UNIQUE,
    nazev_lat       varchar(150) NOT NULL UNIQUE,
    jak_poznat      text NOT NULL DEFAULT '',
    rozsireni       text NOT NULL DEFAULT '',
    potrava         text NOT NULL DEFAULT '',
    hnizdi_od_mesic smallint NOT NULL CHECK (hnizdi_od_mesic BETWEEN 1 AND 12),
    hnizdi_do_mesic smallint NOT NULL CHECK (hnizdi_do_mesic BETWEEN 1 AND 12)
);


CREATE TABLE zapisniky (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lokalita_id uuid NOT NULL REFERENCES lokality(id),
    nazev       varchar(200) NOT NULL,
    cas_od      timestamptz NOT NULL,
    cas_do      timestamptz NOT NULL,
    poznamky    text NOT NULL DEFAULT '',
    viditelnost varchar(10) NOT NULL DEFAULT 'soukromy'
                CHECK (viditelnost IN ('soukromy', 'pratele', 'verejny')),
    CHECK (cas_do >= cas_od)
);


CREATE TABLE zapisnik_ptaky (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    zapisnik_id    uuid NOT NULL REFERENCES zapisniky(id) ON DELETE CASCADE,
    ptak_id        uuid NOT NULL REFERENCES ptaky(id),
    chovani        varchar(100) NOT NULL DEFAULT '',
    cas_pozorovani timestamptz NOT NULL,
    poznamka       text NOT NULL DEFAULT ''
);

CREATE TABLE statistiky_ptaku (
    ptak_id             uuid PRIMARY KEY REFERENCES ptaky(id) ON DELETE CASCADE,
    pocet_pozorovani    integer NOT NULL DEFAULT 0,
    pocet_lokalit       integer NOT NULL DEFAULT 0,
    posledni_pozorovani timestamptz,
    obsazenost_cr       numeric(5,2) NOT NULL DEFAULT 0
);


CREATE INDEX idx_zapisniky_user_cas  ON zapisniky (user_id, cas_od DESC);
CREATE INDEX idx_zapisniky_lokalita  ON zapisniky (lokalita_id);
CREATE INDEX idx_spatreni_zapisnik   ON zapisnik_ptaky (zapisnik_id);
CREATE INDEX idx_spatreni_ptak       ON zapisnik_ptaky (ptak_id);
CREATE INDEX idx_ptaky_typ           ON ptaky (typ_ptaka_id);


CREATE FUNCTION prepocitej_statistiku(p_ptak_id uuid) RETURNS void AS $$
DECLARE
    v_lokalit_celkem integer;
BEGIN
    SELECT count(*) INTO v_lokalit_celkem FROM lokality;

    INSERT INTO statistiky_ptaku
        (ptak_id, pocet_pozorovani, pocet_lokalit, posledni_pozorovani, obsazenost_cr)
    SELECT
        p_ptak_id,
        count(zp.id),
        count(DISTINCT z.lokalita_id),
        max(zp.cas_pozorovani),
        CASE WHEN v_lokalit_celkem = 0 THEN 0
             ELSE round(100.0 * count(DISTINCT z.lokalita_id) / v_lokalit_celkem, 2)
        END
    FROM zapisnik_ptaky zp
    JOIN zapisniky z ON z.id = zp.zapisnik_id
    WHERE zp.ptak_id = p_ptak_id
    ON CONFLICT (ptak_id) DO UPDATE SET
        pocet_pozorovani    = EXCLUDED.pocet_pozorovani,
        pocet_lokalit       = EXCLUDED.pocet_lokalit,
        posledni_pozorovani = EXCLUDED.posledni_pozorovani,
        obsazenost_cr       = EXCLUDED.obsazenost_cr;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION trg_spatreni_statistiky() RETURNS trigger AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        PERFORM prepocitej_statistiku(NEW.ptak_id);
    END IF;
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        PERFORM prepocitej_statistiku(OLD.ptak_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spatreni_statistiky
AFTER INSERT OR UPDATE OR DELETE ON zapisnik_ptaky
FOR EACH ROW EXECUTE FUNCTION trg_spatreni_statistiky();

CREATE FUNCTION trg_zapisnik_lokalita() RETURNS trigger AS $$
DECLARE
    v_ptak uuid;
BEGIN
    FOR v_ptak IN
        SELECT DISTINCT ptak_id FROM zapisnik_ptaky WHERE zapisnik_id = NEW.id
    LOOP
        PERFORM prepocitej_statistiku(v_ptak);
    END LOOP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER zapisnik_zmena_lokality
AFTER UPDATE OF lokalita_id ON zapisniky
FOR EACH ROW EXECUTE FUNCTION trg_zapisnik_lokalita();

CREATE FUNCTION trg_ptak_statistika() RETURNS trigger AS $$
BEGIN
    INSERT INTO statistiky_ptaku (ptak_id) VALUES (NEW.id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ptak_nova_statistika
AFTER INSERT ON ptaky
FOR EACH ROW EXECUTE FUNCTION trg_ptak_statistika();