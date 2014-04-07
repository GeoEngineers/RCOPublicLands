DROP SCHEMA IF EXISTS todo CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE SCHEMA todo;

SET search_path TO todo,public;

CREATE TABLE todo_user ( 
	id                   serial  NOT NULL,
	name                 varchar(100) NOT NULL,
	uid                  uuid NOT NULL,
	json_attributes      text NULL,
	CONSTRAINT user_pkey PRIMARY KEY ( id )
 );


CREATE TABLE todo_item
(
  id serial NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  assigned_to_user_id int NULL,
  CONSTRAINT todo_item_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


ALTER TABLE todo_item ADD CONSTRAINT todo_item_id_fkey FOREIGN KEY ( assigned_to_user_id ) REFERENCES todo_user( id );


/*

INSERT INTO geo_workflow.geo_synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'UpdateTodoItem', now(), null, null, 'Queued', '{"id":1,"status":"Complete"}', null);
INSERT INTO geo_workflow.geo_synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'NewTodoItem', now(), null, null, 'Queued', '{"description":"Call Dentist","status":"Incomplete"}', null);
INSERT INTO geo_workflow.geo_synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'NewTodoItem', now(), null, null, 'Queued', '{"description":"This One Should Break","status":"Incomplete","badfield":"badvalue"}', null);


INSERT INTO todo_item(description, status, latitude, longitude)
VALUES ('Get groceries', 'Incomplete', 46.8437556, -122.5308429);

INSERT INTO todo_item(description, status, latitude, longitude)
VALUES ('Walk the dog', 'Incomplete', 47.3272185, -122.1411072);

INSERT INTO todo_item(description, status, latitude, longitude) 	
VALUES ('Do the dishes', 'Incomplete',47.4413089, -122.1808897);



SELECT * FROM todo_item;
SELECT * FROM geo_synch_event;

delete from geo_synch_event;
delete from todo_item;
*/


