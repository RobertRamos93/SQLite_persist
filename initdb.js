const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./blogging.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, title TEXT, body TEXT, FOREIGN KEY(userId) REFERENCES users(id))");
    db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, body TEXT, FOREIGN KEY(postId) REFERENCES posts(id))");
});

db.close();
