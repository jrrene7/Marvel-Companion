CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_digest TEXT NOT NULL,
  thread_id TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  thumbnail TEXT,
  user_id INTEGER
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  thumbnail TEXT,
  description TEXT,
  price INTEGER,
  user_id INTEGER
);

CREATE TABLE IF NOT EXISTS user_books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  book_id INTEGER REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS user_characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  characters_id INTEGER REFERENCES characters(id)
);
