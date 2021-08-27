CREATE SCHEMA nickreq;

CREATE TABLE if not exists nickreq.requests (
	user_id VARCHAR ( 50 ) NOT NULL,
	nick VARCHAR ( 50 ) NOT NULL,
	state BOOLEAN
);
