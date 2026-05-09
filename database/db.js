const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../stockr.db'),
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('SQLite Database Connected');
    }
  }
);

// USERS TABLE

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'employee'
)
`);

// PRODUCTS TABLE

db.run(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INTEGER,
  quantity INTEGER,
  image TEXT
)
`);

module.exports = db;