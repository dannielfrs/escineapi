const mysql = require('mysql');
const { promisify } = require('util');  // NodeJS module that converts callbacks into async/await
const { databaseConnection } = require('./config');

const db = mysql.createPool(databaseConnection);  // This mysql module does not support async/await

db.getConnection((error, connection) => {
    if (error) {
        console.log(error.code)
        console.log(error.sqlMessage)
    } else {
        console.log('DB is connected');
    }
    if (connection) connection.release();
    return;
});

// Promisify Pool Querys
db.query = promisify(db.query);  // Convert async/await to callbacks

module.exports = db;

