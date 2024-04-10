#!/bin/bash
# Entrypoint for the postgreSQL database that creates a test database for the tests
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE visit_test_database;
	GRANT ALL PRIVILEGES ON DATABASE visit_test_database TO visit_user;
	\connect visit_test_database;
EOSQL