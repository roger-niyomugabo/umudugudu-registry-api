import dotenv from 'dotenv';
dotenv.config();
// Config for the DB and the Sequelize CLI
const db_config = {
    'development': {
        'username': process.env.VISIT_DB_USER || 'postgres',
        'password': process.env.VISIT_DB_PASSWORD || 'postgres',
        'database': process.env.VISIT_DB_NAME || 'visit',
        'host': process.env.VISIT_DB_HOST || 'localhost',
        'port': parseInt(process.env.VISIT_DB_PORT || '5432'),
        'dialect': 'postgres',
    },
    // Hardcode test_env vars so test functions do not get into any other system
    'test': {
        'username': 'visit_user',
        'password': 'visit_pass',
        'database': 'visit_database',
        'host': 'visit_db',
        'port': 5432,
        'dialect': 'postgres',
    },
    'production': {
        'username': process.env.VISIT_DB_USER,
        'password': process.env.VISIT_DB_PASSWORD,
        'database': process.env.VISIT_DB_NAME,
        'host': process.env.VISIT_DB_HOST,
        'port': parseInt(process.env.VISIT_DB_PORT),
        'dialect': 'postgres',
    },
};

export { db_config };
