require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database');
const store = require('./sessionStore');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login.html');
  }
  res.send(`<h2>Hello, ${req.session.username}!</h2><a href="/logout">Logout</a>`);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const valid = await db.verifyUser(username, password);

  if (!valid) {
    return res.send('Invalid username or password. <a href="/login.html">Try again</a>');
  }

  // 強制踢掉先前登入者
  const previousSessionId = await store.getSessionId(username);
  if (previousSessionId && previousSessionId !== req.sessionID) {
    store.invalidateSession(previousSessionId);
  }

  req.session.username = username;
  await store.setSessionId(username, req.sessionID);
  res.redirect('/');
});

app.get('/logout', async (req, res) => {
  if (req.session.username) {
    await store.clearSession(req.session.username);
  }
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});