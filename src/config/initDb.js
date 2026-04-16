const mysql2 = require('mysql2');

// ✅ FIX: explicitly load .env from root folder
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// 🔍 Debug (optional – remove later)
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASSWORD);

// Connect WITHOUT database first to create it
const connection = mysql2.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
});

const SQL_CREATE_DB = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'school_db'}`;
const SQL_USE_DB = `USE ${process.env.DB_NAME || 'school_db'}`;

const SQL_CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to MySQL server');

  connection.query(SQL_CREATE_DB, (err) => {
    if (err) {
      console.error('❌ Failed to create database:', err.message);
      process.exit(1);
    }

    console.log(`✅ Database '${process.env.DB_NAME || 'school_db'}' ready`);

    connection.query(SQL_USE_DB, (err) => {
      if (err) {
        console.error('❌ Failed to select database:', err.message);
        process.exit(1);
      }

      connection.query(SQL_CREATE_TABLE, (err) => {
        if (err) {
          console.error('❌ Failed to create schools table:', err.message);
          process.exit(1);
        }

        console.log('✅ Table "schools" ready');
        console.log('\n🎉 Database setup complete! You can now start the server.\n');

        connection.end();
      });
    });
  });
});