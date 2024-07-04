import {createPool} from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('Base de datos CONECTADA');
    })
    .catch(err => console.error('Error connecting to database', err));


export default pool;