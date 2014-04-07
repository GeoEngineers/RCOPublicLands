DROP SCHEMA IF EXISTS geo_env_quality CASCADE;

CREATE SCHEMA geo_env_quality;

SET search_path TO geo_env_quality,public;

-- Table: analyte_units_type
CREATE TABLE analyte_units_type
(
  id serial NOT NULL,
  name varchar(100) NOT NULL,
  CONSTRAINT analyte_units_type_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analyte_units_type
  OWNER TO postgres;

-- Table: eq_user
CREATE TABLE eq_user
(
  id serial NOT NULL,
  uid uuid NOT NULL,
  name varchar(500) NOT NULL,
  json_attributes text NULL,
  CONSTRAINT eq_user_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE eq_user
  OWNER TO postgres;

CREATE TABLE analyte_type
(
  id serial NOT NULL,
  name varchar(500) NOT NULL,
  abbreviation varchar(10) NULL,
  json_attributes text NULL,
  CONSTRAINT analyte_type_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analyte_type
  OWNER TO postgres;

CREATE TABLE analyte_sample_source
(
  id serial NOT NULL,
  uid uuid NOT NULL,
  name varchar(100) NOT NULL,
  json_attributes text NULL,
  CONSTRAINT analyte_sample_source_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analyte_sample_source
  OWNER TO postgres;

-- Table: sampling_project
CREATE TABLE sampling_project
(
  id serial NOT NULL,
  name varchar(500) NOT NULL,
  uid uuid NOT NULL,
  start_date date,
  end_date date,
  json_attributes text NULL,
  CONSTRAINT sampling_project_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sampling_project
  OWNER TO postgres;

-- Table: sampling_project_eq_user
CREATE TABLE sampling_project_eq_user
(
  id serial NOT NULL,
  eq_user_id integer NOT NULL,
  sampling_project_id integer NOT NULL,
  permission_type character varying(20) NOT NULL DEFAULT 'DENY',
  CONSTRAINT spequ_pkey PRIMARY KEY (id),
  CONSTRAINT spequ_eq_user_id_fkey FOREIGN KEY (eq_user_id)
      REFERENCES eq_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT spequ_sampling_project_id_fkey FOREIGN KEY (sampling_project_id)
      REFERENCES sampling_project (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sampling_project_eq_user
  OWNER TO postgres;



-- Table: analyte_sample_requirement
CREATE TABLE analyte_sample_requirement
(
  id serial NOT NULL,
  analyte_sample_source_id integer NOT NULL,
  analyte_type_id integer NOT NULL,
  analyte_units_type_id integer NOT NULL, 
  sampling_project_id integer NOT NULL,
  sampling_frequency varchar(20) NOT NULL,  -- CONTINUOUS, HOURLY, DAILY, WEEKLY, MONTHLY
  CONSTRAINT asr_pkey PRIMARY KEY (id),
  CONSTRAINT asr_analyte_sample_source_id_fkey FOREIGN KEY (analyte_sample_source_id)
      REFERENCES analyte_sample_source (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT asr_sampling_project_id_fkey FOREIGN KEY (sampling_project_id)
      REFERENCES sampling_project (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT asr_analyte_units_type_id_fkey FOREIGN KEY (analyte_units_type_id)
      REFERENCES analyte_units_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT asr_analyte_type_id_fkey FOREIGN KEY (analyte_type_id)
      REFERENCES analyte_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analyte_sample_requirement
  OWNER TO postgres;


-- Table: analyte_limit
CREATE TABLE analyte_limit
(
  id serial NOT NULL,
  limit_value real NOT NULL,
  limit_type varchar(20) NOT NULL,  -- UPPER, LOWER
  limit_rollup_type varchar(20) NOT NULL,  -- NONE, WEEKLY, MONTHLY
  analyte_sample_requirement_id integer NOT NULL,
  CONSTRAINT analyte_limit_pkey PRIMARY KEY (id),
  CONSTRAINT analyte_limit_asr_id_fkey FOREIGN KEY (analyte_sample_requirement_id)
      REFERENCES analyte_sample_requirement (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analyte_limit
  OWNER TO postgres;



-- Table: sample
CREATE TABLE sample
(
  id serial NOT NULL,
  captured_by_eq_user_id integer NULL,
  scheduled_window_open_date date NULL,
  scheduled_window_close_date date NULL,
  executed_date date NULL,
  analyte_sample_source_id integer NOT NULL,
  json_attributes text NULL,
  CONSTRAINT se_pkey PRIMARY KEY (id),
  CONSTRAINT se_eq_user_id_fkey FOREIGN KEY (captured_by_eq_user_id)
      REFERENCES eq_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT se_ass_id_fkey FOREIGN KEY (analyte_sample_source_id)
      REFERENCES analyte_sample_source (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sample
  OWNER TO postgres;

CREATE TABLE result
(
  id serial NOT NULL,
  sample_id integer NOT NULL,
  analyte_type_id integer NOT NULL,
  analyte_units_type_id integer NOT NULL, 
  captured_by_eq_user_id integer NULL,
  result_value text,
  json_attributes text,
  analyte_sample_requirement_id integer NULL,
  CONSTRAINT result_pkey PRIMARY KEY (id),
  CONSTRAINT result_eq_user_id_fkey FOREIGN KEY (captured_by_eq_user_id)
      REFERENCES eq_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT result_sample_id_fkey FOREIGN KEY (sample_id)
      REFERENCES sample (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT result_asr_id_fkey FOREIGN KEY (analyte_sample_requirement_id)
      REFERENCES analyte_sample_requirement (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT result_analyte_units_type_id_fkey FOREIGN KEY (analyte_units_type_id)
      REFERENCES analyte_units_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT asr_analyte_type_id_fkey FOREIGN KEY (analyte_type_id)
      REFERENCES analyte_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE result
  OWNER TO postgres;



-- INSERT INTO analyte_units_type (name)
-- VALUES ('%');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Deg C');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Deg F');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Degrees C');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Degrees F');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('feet');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('hours');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('inches');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('meq/l');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/kg');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Al');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as As');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Ba');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Be');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Ca');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as CaCO3');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Cd');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as CN');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Co');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Cr');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Cu');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as F');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Fe');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Hg');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as K');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Mg');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Mn');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Mo');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as N');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Na');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Ni');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Pb');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as S');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Sb');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Se');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as SO4');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Tl');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('mg/l as Zn');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('MGD');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('micromho');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('micromhocm');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('million gallons');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('msl');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('NTU');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('pc/l');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('pH');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('SU');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('ug/l');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('umhos/cm');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('umhos/cm @ 25C');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('units');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Chronic Toxicity');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Pass/Fail');
-- INSERT INTO analyte_units_type (name)
-- VALUES ('Pass/Fail  Chronic T');

