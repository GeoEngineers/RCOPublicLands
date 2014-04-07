/*
these tables are meant to be included in your application schema(rco, fcx, etc). in most cases,
the lib.js components are expecting this .  other
tables and views in your schema should reference these tables accordingly.  cut-and-paste these
into your schema definition .sql.
*/

--  location
CREATE TABLE location
(
  id serial NOT NULL,
  name varchar(500) NOT NULL,
  geom geometry NULL,
  address1 character varying(200) NULL,
  address2 character varying(200) NULL,
  city character varying(100) NULL,
  county character varying(100) NULL,
  state character varying(100) NULL,
  country character varying(100) NULL,
  postal_code character varying(20) NULL,
  CONSTRAINT location_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE geo_location
  OWNER TO postgres;

CREATE FUNCTION update_location_geom() RETURNS trigger AS $update_location_geom$
BEGIN
	NEW.geom = ST_SetSRID(ST_Point(NEW.mercator_lat, NEW.mercator_lon), 4326);
	RETURN NEW;
END;
$update_location_geom$ LANGUAGE plpgsql;


CREATE TRIGGER insert_location
	BEFORE INSERT OR UPDATE ON location
	FOR ROW
	EXECUTE PROCEDURE update_location_geom();

--  end location
