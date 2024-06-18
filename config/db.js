import {createPool} from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
    host: '',
    user: '',
    password: '',
    database: '',
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