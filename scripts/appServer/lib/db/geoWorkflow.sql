DROP SCHEMA IF EXISTS geo_workflow CASCADE;

CREATE SCHEMA geo_workflow;

SET search_path TO geo_workflow,public;

CREATE TABLE log_entry
(
  id serial NOT NULL,
  log_category character varying(50) NOT NULL,
  log_level character varying(20) NOT NULL,
  log_timestamp timestamp without time zone NOT NULL DEFAULT now(),
  source character varying(500),
  message text,
  data_json text,
  CONSTRAINT log_entry_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE log_entry
  OWNER TO postgres;


CREATE TABLE workflow
(
  id serial NOT NULL,
  job_identifier character varying(100) NOT NULL,
  priority_weight int NOT NULL DEFAULT 50,
  data_json text,
  workflow_type character varying(50) NOT NULL,
  CONSTRAINT workflow_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE workflow
  OWNER TO postgres;

CREATE TABLE workflow_task
(
  id serial NOT NULL,
  uid uuid NOT NULL,
  workflow_id integer NULL,
  priority_weight int NOT NULL DEFAULT 50,
  queue_name character varying(100) NOT NULL,
  task_type character varying(100) NOT NULL,
  queued_timestamp timestamp without time zone NOT NULL DEFAULT now(),
  scheduled_timestamp timestamp without time zone,
  begin_process_timestamp timestamp without time zone,
  end_process_timestamp timestamp without time zone,
  process_status character varying(30) NOT NULL,
  data_json text,
  result_message text,
  CONSTRAINT workflow_task_pkey PRIMARY KEY (id),
  CONSTRAINT workflow_task_workflow_id_fkey FOREIGN KEY (workflow_id)
      REFERENCES workflow (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE workflow_task
  OWNER TO postgres;


CREATE TABLE workflow_task_dependency
(
  id serial NOT NULL,
  required_task_id int NOT NULL,
  dependent_task_id int NOT NULL,
  CONSTRAINT workflow_task_dependency_pkey PRIMARY KEY (id),
  CONSTRAINT wtd_required_task_id_fkey FOREIGN KEY (required_task_id)
      REFERENCES workflow_task (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT wtd_dependent_task_id_fkey FOREIGN KEY (dependent_task_id)
      REFERENCES workflow_task (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE workflow_task_dependency
  OWNER TO postgres;


CREATE TABLE audit_entry
(
  id serial NOT NULL,
  event_timestamp timestamp without time zone NOT NULL DEFAULT now(),
  event_type character varying(50) NOT NULL,
  message character varying(100),
  event_schema character varying(100),
  event_table character varying(100),
  event_record_id integer,
  customer_user_id integer,
  data_json text,
  CONSTRAINT audit_entry_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE audit_entry
  OWNER TO postgres;

DROP VIEW IF EXISTS workflow_task_view;
CREATE OR REPLACE VIEW workflow_task_view AS 
	SELECT wt.*, w.job_identifier, w.data_json as workflow_data_json
	  FROM workflow_task wt
	  LEFT OUTER JOIN workflow w ON w.id = wt.workflow_id; 
ALTER TABLE workflow_task_view
  OWNER TO postgres;

DROP VIEW IF EXISTS next_workflow_task_view;
CREATE OR REPLACE VIEW next_workflow_task_view AS 
	SELECT DISTINCT ON (wt.queue_name) 
	       wt.*, w.job_identifier, w.data_json as workflow_data_json
	  FROM workflow_task wt
	  LEFT OUTER JOIN workflow w ON w.id = wt.workflow_id
	  WHERE process_status = 'QUEUED'
		AND scheduled_timestamp IS NOT NULL
		AND scheduled_timestamp < now()
	  ORDER BY wt.queue_name, wt.priority_weight DESC, wt.scheduled_timestamp; 
ALTER TABLE next_workflow_task_view
  OWNER TO postgres;

/*
SET search_path TO geo_workflow,public;

select * from workflow_task;
select * from workflow_task_view;
select * from next_workflow_task_view;
select * from workflow;
select * from log_entry;

delete from workflow_task;


INSERT INTO workflow(id, job_identifier, priority_weight, workflow_data, workflow_type)
VALUES (1, 'AA-USFWReport-001259-02', 50, '{Email: { To: joe@plumber.com, From: admin@avianaudit.com, Subject: approve this, Body: the message, IncidentId: 02-00125 }}', 'Email');
INSERT INTO workflow(id, job_identifier, priority_weight, workflow_data, workflow_type)
VALUES (2, 'SynchWithCrmSystem', 50, '', 'CrmSynch');
INSERT INTO workflow(id, job_identifier, priority_weight, workflow_data, workflow_type)
VALUES (3, 'SynchGeoLogin', 50, '', 'GeoLoginSynch');

INSERT INTO workflow_task(queue_name, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 'SendEmail', 1,
	'2013-01-01 05:00:00', '2013-01-01 05:10:00', '2013-01-01 05:10:00', '2013-01-01 05:11:00',
	'Complete', 'Email Sent');
INSERT INTO workflow_task(queue_name, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 'CheckUSFWApprovalConfirmation', 1,
	'2013-01-05 05:00:00', '2013-01-05 05:10:00', '2013-01-05 05:10:00', '2013-01-05 05:11:00',
	'Complete', 'No approval response - sending reminder email');
INSERT INTO workflow_task(queue_name, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 'SendEmail', 1,
	'2013-01-05 05:11:00', '2013-01-05 05:20:00', '2013-01-05 05:20:00', '2013-01-05 05:21:00',
	'Complete', 'Email Sent');
INSERT INTO workflow_task(queue_name, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 'CheckUSFWApprovalConfirmation', 1,
	'2013-01-09 05:00:00', '2013-01-09 05:10:00', '2013-01-09 05:10:00', '2013-01-09 05:11:00',
	'Complete', 'Approved - sending USFW report');
INSERT INTO workflow_task(queue_name, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 'SendUSFWReport', 1,
	'2013-01-11 05:11:00', '2013-01-11 05:11:00',null, null,
	'Queued', '');
INSERT INTO workflow_task(queue_name, priority_weight, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue', 60, 'SynchWithCrmSystem', 2,
	'2013-01-11 05:11:00', null,null, null,
	'Queued', '');
INSERT INTO workflow_task(queue_name, priority_weight, request_type, workflow_id,
	queued_timestamp, scheduled_timestamp, begin_process_timestamp, end_process_timestamp, 
	process_status, result_message)
VALUES ('TestQueue-2', 90, 'SynchGeoLogin', 3,
	'2013-01-11 05:11:00', '2013-01-11 05:11:00',null, null,
	'Queued', '');

select setval('workflow_task_id_seq', 100);
select setval('workflow_id_seq', 100);

*/



