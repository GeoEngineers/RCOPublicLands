drop schema if exists geo_logger cascade;

CREATE SCHEMA geo_logger;

SET search_path TO geo_logger,public;

CREATE TABLE log_entry
(
  id serial NOT NULL,
  log_category character varying(50) NOT NULL,
  log_level character varying(20) NOT NULL,
  log_timestamp timestamp without time zone NOT NULL DEFAULT now(),
  source character varying(500),
  message text,
  json_attributes text,
  CONSTRAINT log_entry_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE log_entry
  OWNER TO postgres;


-- select * from log_entry;
-- delete from log_entry;

-- insert into "geo_logger"."log_entry" 
-- 	("log_category", "log_level", "message", "source") 
-- 	values ('Api', 'Low', 'test', 'test-3982c656-8858-4956-acf3-389249c6bda5');
