drop schema if exists geo_login cascade;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE SCHEMA geo_login;

SET search_path TO geo_login,public;

CREATE TABLE application ( 
	id serial  NOT NULL,
	uid uuid NOT NULL,
	name varchar(100)  NOT NULL,
	json_attributes text NULL,
	CONSTRAINT application_pkey PRIMARY KEY ( id )
 );

CREATE TABLE license_type ( 
	id                   serial  NOT NULL,
	application_id   integer NOT NULL,
	name                 varchar(100)  NOT NULL,
	license_type_key     varchar(20) NOT NULL,
	json_attributes	     text NULL,
	CONSTRAINT license_type_pkey PRIMARY KEY ( id )
 );

CREATE TABLE user_login ( 
	id                   serial  NOT NULL,
	contact_id           integer NOT NULL,
	login                varchar(100)  NOT NULL,
	hashed_password      text NOT NULL,
	CONSTRAINT user_login_pkey PRIMARY KEY ( id )
 );

CREATE TABLE contact ( 
	id                   serial  NOT NULL,
	uid                  uuid DEFAULT uuid_generate_v1() NOT NULL,
	organization_id      integer  NOT NULL,
	first_name           varchar(100)  NOT NULL,
	last_name            varchar(100)  NOT NULL,
	phone_number         varchar(100)  ,
	email                varchar(100)  ,
	job_title            varchar(100)  ,
	json_attributes      text NULL,
	location_id          integer  ,
	CONSTRAINT contact_pkey PRIMARY KEY ( id )
 );

CREATE TABLE license ( 
	id                   serial  NOT NULL,
	organization_id      integer  NOT NULL,
	contact_id           integer  NULL,
	license_type_id      integer  NOT NULL,
	status               character varying(20) NOT NULL DEFAULT 'INACTIVE',
	activation_date      timestamp NULL,
	expiration_date      timestamp NULL,
	json_attributes text NULL,
	CONSTRAINT license_pkey PRIMARY KEY ( id )
 );

CREATE TABLE login_token ( 
	id                   serial  NOT NULL,
	user_login_id        integer  NOT NULL,
	token                uuid  NOT NULL,
	expiration_date      timestamp  NOT NULL,
	CONSTRAINT login_token_pkey PRIMARY KEY ( id )
 );

CREATE TABLE organization ( 
	id serial  NOT NULL,
	uid uuid NOT NULL,
	parent_organization_id integer,
	name varchar(100)  NOT NULL,
	json_attributes text NULL,
	CONSTRAINT organization_pkey PRIMARY KEY ( id )
 );

CREATE TABLE location ( 
	id serial NOT NULL,
	name varchar(500) NULL,
	mercator_lat double precision NULL,
	mercator_lon double precision NULL,
	geom geometry NULL,
	address1 character varying(200) NULL,
	address2 character varying(200) NULL,
	city character varying(100) NULL,
	county character varying(100) NULL,
	state character varying(100) NULL,
	country character varying(100) NULL,
	postal_code character varying(20) NULL,
	json_attributes text NULL,
	CONSTRAINT location_pkey PRIMARY KEY ( id )
 );

ALTER TABLE contact ADD CONSTRAINT contact_location_id_fkey FOREIGN KEY ( location_id ) REFERENCES location( id );

ALTER TABLE license ADD CONSTRAINT license_contact_id_fkey FOREIGN KEY ( contact_id ) REFERENCES contact( id );

ALTER TABLE license ADD CONSTRAINT license_organization_id_fkey FOREIGN KEY ( organization_id ) REFERENCES organization( id );

ALTER TABLE license ADD CONSTRAINT license_type_id_fkey FOREIGN KEY ( license_type_id ) REFERENCES license_type( id );

ALTER TABLE login_token ADD CONSTRAINT login_token_user_login_id_fkey FOREIGN KEY ( user_login_id ) REFERENCES user_login( id );

ALTER TABLE organization ADD CONSTRAINT parent_organization_id_fkey FOREIGN KEY ( parent_organization_id ) REFERENCES organization( id );

ALTER TABLE contact ADD CONSTRAINT contact_organization_id_fkey FOREIGN KEY ( organization_id ) REFERENCES organization( id );

ALTER TABLE user_login ADD CONSTRAINT user_login_contact_id_fkey FOREIGN KEY ( contact_id ) REFERENCES contact( id );

ALTER TABLE license_type ADD CONSTRAINT license_type_application_id_fkey FOREIGN KEY ( application_id ) REFERENCES application (id);


-- DROP VIEW contact_view

CREATE VIEW contact_view AS 
 SELECT c.*, o.name AS organization_name, l.name as location_name,
 l.address1, l.address2, l.city, l.county, l.country, l.postal_code,
 l.mercator_lat, l.mercator_lon, l.geom
 FROM contact c
 INNER JOIN organization o on c.organization_id = o.id
 LEFT OUTER JOIN location l on c.location_id = l.id;


-- DROP VIEW customer_user_view

CREATE VIEW customer_user_view AS 
 SELECT c.*, o.name AS organization_name, l.id AS license_id, l.status AS license_status, 
 l.json_attributes AS license_attributes, lt.name AS license_type_name,
 lt.license_type_key, a.name AS application_name, ul.id AS user_login_id,
 ul.login, ul.hashed_password
 FROM contact c
 INNER JOIN license l on l.contact_id = c.id
 INNER JOIN license_type lt on lt.id = l.license_type_id
 INNER JOIN application a on a.id = lt.application_id
 INNER JOIN organization o on c.organization_id = o.id
 LEFT OUTER JOIN user_login ul on ul.contact_id = c.id;

-- DROP VIEW user_login_token_view

CREATE VIEW user_login_token_view AS
SELECT lt.*, ul.login, c.id AS user_id, c.first_name, c.last_name, c.email
FROM login_token lt
INNER JOIN user_login ul on ul.id = lt.user_login_id
INNER JOIN contact c on c.id = ul.contact_id;


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


-- INSERT INTO application(uid, name)
-- VALUES ('050fa96a-35bd-4cad-b8b7-fccbebf5dc07', 'Test Application');
-- 
-- INSERT INTO license_type(name, license_type_key, application_id)
-- VALUES ('Test SuperAdmin License', 'UTSA', (SELECT id FROM application WHERE name = 'Test Application'));
-- INSERT INTO license_type(name, license_type_key, application_id)
-- VALUES ('Test Admin License', 'UTA', (SELECT id FROM application WHERE name = 'Test Application'));
-- INSERT INTO license_type(name, license_type_key, application_id)
-- VALUES ('Test User License', 'UTU', (SELECT id FROM application WHERE name = 'Test Application'));
-- 
-- INSERT INTO location(name, address1, city, county, state, country, postal_code, mercator_lat, mercator_lon)
-- VALUES ('Test Location', 'Test Address', 'Test City', 'Test', 'TST', 'TESTISTAN', '90210', 26.302584, -10.599989);
-- 
-- INSERT INTO organization(name, uid)
-- VALUES ('Test Organization', '47cd633e-10d3-4265-910f-ab27dc799884');
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('SuperAdmin', 'McTesterson', '555-555-TEST', 'superadmin@test.com', 'Super Admin Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Admin', 'Testofferson', '555-555-TEST', 'admin@test.com', 'Admin Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('User', 'Testerington', '555-555-TEST', 'user@test.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Blair', 'Smartmine', '555-555-TEST', 'bdeaver@smartmine.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Blair', 'GeoEngineers', '555-555-TEST', 'bdeaver@geoengineers.com', 'Admin Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Mike', 'Smartmine', '555-555-TEST', 'mmills@smartmine.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Mike', 'GeoEngineers', '555-555-TEST', 'mmills@geoengineers.com', 'Admin Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Jonny', 'Smartmine', '555-555-TEST', 'jstopchick@smartmine.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Jonny', 'GeoEngineers', '555-555-TEST', 'jstopchick@geoengineers.com', 'Admin Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Kevin', 'Smartmine', '555-555-TEST', 'kburkett@smartmine.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- INSERT INTO contact(first_name, last_name, phone_number, email, job_title, uid, organization_id, location_id)
-- VALUES ('Kevin', 'GeoEngineers', '555-555-TEST', 'kburkett@geoengineers.com', 'User Tester', uuid_generate_v4(),
-- 		(SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM location WHERE name = 'Test Location'));
-- 
-- 
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('superadmin@test.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'superadmin@test.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('admin@test.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'admin@test.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('user@test.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'user@test.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('bdeaver@smartmine.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'bdeaver@smartmine.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('bdeaver@geoengineers.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'bdeaver@geoengineers.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('mmills@smartmine.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'mmills@smartmine.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('mmills@geoengineers.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'mmills@geoengineers.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('jstopchick@smartmine.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'jstopchick@smartmine.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('jstopchick@geoengineers.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'jstopchick@geoengineers.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('kburkett@smartmine.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'kburkett@smartmine.com'));
-- INSERT INTO user_login(login, hashed_password, contact_id)
-- VALUES ('kburkett@geoengineers.com', 'OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw==', (SELECT id FROM contact WHERE email = 'kburkett@geoengineers.com'));
-- 
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'superadmin@test.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test SuperAdmin License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'admin@test.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test Admin License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'user@test.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test User License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'bdeaver@smartmine.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test User License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'bdeaver@geoengineers.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test Admin License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'mmills@smartmine.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test User License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'mmills@geoengineers.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test Admin License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'jstopchick@smartmine.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test User License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'jstopchick@geoengineers.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test Admin License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'kburkett@smartmine.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test User License'),
-- 		'ACTIVE');
-- INSERT INTO license(organization_id, contact_id, license_type_id, status)
-- VALUES ( (SELECT id FROM organization WHERE name = 'Test Organization'),
-- 		(SELECT id FROM contact WHERE email = 'kburkett@geoengineers.com'),
-- 		(SELECT id FROM license_type WHERE name = 'Test Admin License'),
-- 		'ACTIVE');
-- 
-- update user_login
-- set hashed_password = 'sha256$aa138c746844dc7cf0ace799$1000$f55e161a6fc55e9ce53a19edabe5fceaec63d5c0ece83950d048b48b49719df3';

-- select uuid_generate_v4()
-- SET search_path TO geo_login,public;

-- select * from customer_user_view
-- select * from user_login_token_view 
-- select * from user_login;
-- select * from login_token;
-- select * from location;
-- select * from contact;
-- select * from contact_view;
-- select * from license_type;

-- delete from login_token

-- update contact set email = 'defunct' where email = 'stlbucket@gmail.com';
-- update user_login set login = 'defunct' where login = 'stlbucket@gmail.com';


