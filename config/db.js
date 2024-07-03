import {createPool} from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
    host: 'bpio225ve5f64ef6peb4-mysql.services.clever-cloud.com',
    user: 'ucjtyzfnhbgq7ajn',
    password: 'VXSCRukVXkotN7u87qFB',
    database: 'bpio225ve5f64ef6peb4',
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