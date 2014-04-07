drop schema if exists geo_synch cascade;

CREATE SCHEMA geo_synch;

SET search_path TO geo_synch,public;

-- Table: synch_event
CREATE TABLE synch_event
(
  id serial NOT NULL,
  uid uuid NOT NULL,
  queue_name varchar(100) NOT NULL,
  request_type varchar(100) NOT NULL,
  queued_timestamp timestamp NOT NULL,
  begin_process_timestamp timestamp NULL,
  end_process_timestamp timestamp NULL,
  synch_status varchar(20) NOT NULL,
  event_data text,
  result_message text,
  CONSTRAINT geo_synch_event_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE synch_event
  OWNER TO postgres;


/*
INSERT INTO synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'UpdateTodoItem', now(), null, null, 'Queued', '{"Id":1,"Status":"Complete"}', null);
INSERT INTO synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'NewTodoItem', now(), null, null, 'Queued', '{"Description":"Call Dentist","Status":"Incomplete"}', null);
INSERT INTO synch_event(uid, queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES (uuid_generate_v4(), 'Default', 'NewTodoItem', now(), null, null, 'Queued', '{"Description":"This One Should Break","Status":"Incomplete"}', null);

SELECT * FROM synch_event;
*/
