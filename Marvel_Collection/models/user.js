const bcrypt = require('bcryptjs');
const db = require('../db/config');

const User = {};

User.create = (user) => {
  const passwordDigest = bcrypt.hashSync(user.password, 10);
  return db.oneOrNone(
    'INSERT INTO users (email, password_digest, thread_id) VALUES (?, ?, ?) RETURNING *',
    [user.email, passwordDigest, '']
  );
};

User.findByEmail = (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = ?', [email]);
};

User.findById = (id) => {
  return db.oneOrNone('SELECT * FROM users WHERE id = ?', [id]);
};

User.findByEmailMiddleware = (req, res, next) => {
  const email = req.user.email;
  User
    .findByEmail(email) // here we're using the nonmiddleware version above, getting back a promise
    .then((userData) => {
      res.locals.userData = userData;
      next();
    }).catch(err => console.log('ERROR:', err));
};

module.exports = User;