require('dotenv').config();

module.exports = {
  secret: process.env.SESSION_SECRET || '1221221225465452',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60
  }
};