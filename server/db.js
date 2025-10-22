const mysql = require('mysql2');

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'hamburgueria',
    waitForConnections: true,
    connectionLimit: 10,  
    queueLimit: 0
});

module.exports = conn;
