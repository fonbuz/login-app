const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (username TEXT PRIMARY KEY, password TEXT)');
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['user1', 'pass1']);
});

module.exports = {
  verifyUser: (username, password) => {
    return new Promise((resolve) => {
      db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        resolve(!!row);
      });
    });
  }
};