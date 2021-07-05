const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const secret = 'really secret phrase';

app.use('/', express.static(path.join(__dirname, '/public')));

const users = { // registered users (not in db just for demonstration of jwt session management)
  admin: {
    "username": "admin",
    "password": "password",
    "userType": "admin",
  },
  testAdmin: {
    "username": "testAdmin",
    password: "password",
    "userType": "admin",
  },
  plainUser: {
    "username": "plainUser",
    password: "password",
    "userType": "user",
  },
  testUser: {
    "username": "testUser",
    password: "password",
    "userType": "user",
  }
}

app.post('/login', (req, res) => { // generate jwt on login (need to add userType)
  if (req.body.username && req.body.password) {
    const {username} = req.body;
    const {password} = req.body;

    jwt.sign({username, password}, secret, (err, token) => { // all users are accepted, for demonstrating jwt only.
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token);
        res.status(200).sendFile(path.join(__dirname, '/home.html'));
      }
    })
  } else {
    res.sendStatus(400);
  }
});

app.get('/users', (req, res) => { // list registered users if validated (admin or user)
  const {token} = req.cookies;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) res.sendStatus(403);
    if (decoded) {
      res.sendStatus(200);
      // list users
    };
  })
})

app.listen(80);