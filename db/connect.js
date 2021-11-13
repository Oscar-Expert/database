require('dotenv').config();
const mysql = require('mysql');

console.log(process.env.LOCAL_HOST)

const connection = mysql.createConnection({
    host: process.env.LOCAL_HOST,
    user: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.LOCAL_DATABASE,
    port: process.env.LOCAL_PORT,
});

connection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

module.exports = connection;
