drop schema if exists geo_edp cascade;

CREATE SCHEMA geo_edp;

SET search_path TO geo_edp,public;

CREATE TABLE external_data_provider
(
  id serial NOT NULL,
  name text NOT NULL,
  CONSTRAINT external_data_provider_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE external_data_provider
  OWNER TO postgres;

CREATE TABLE edp_record_info
(
  id serial NOT NULL,
  edp_id integer NOT NULL,
  internal_table_name character varying(100) NOT NULL,
  internal_record_id integer NULL,
  external_record_id character varying(100) NULL,
  aggregated_import_data_json text NOT NULL,
  last_aggregated_timestamp timestamp NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT edp_marker_info_pkey PRIMARY KEY (id),
  CONSTRAINT edp_marker_info_edp_id_fkey FOREIGN KEY (edp_id)
      REFERENCES external_data_provider (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE edp_record_info
  OWNER TO postgres;

INSERT INTO external_data_provider(name)
VALUES ('Test');

-- SET search_path TO geo_edp,public;

-- select * from edp_record_info;


