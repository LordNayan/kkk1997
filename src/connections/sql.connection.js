const config = require("../config/config");
const mysql = require('mysql2/promise');

// Create a connection to the database
const connection = mysql.createPool({
    host: config.db.HOST,
    user: config.db.USER,
    password: config.db.PASSWORD,
    database: config.db.DB,
    port: config.db.PORT,
    waitForConnections: true,
    connectionLimit: 99,
    queueLimit: 0,
    dateStrings: true
});
module.exports = connection;