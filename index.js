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
// create app.use(middleware for jwt verify);

const users = [ // registered users (not in db just for demonstration of jwt session management)
    {
        "name": "admin",
        "username": "admin",
        "password": "123",
        "userType": "admin",
    },
    {
        "name": "testAdmin",
        "username": "testAdmin",
        password: "123",
        "userType": "admin",
    },
    {
        "name": "user",
        "username": "user",
        password: "123",
        "userType": "user",
    },
    {
        "name": "testUser",
        "username": "testUser",
        password: "123",
        "userType": "user",
    }
]

app.post('/login', (req, res) => { // generate jwt on login
    if (req.body.username && req.body.password) {
        const { username } = req.body;
        const { password } = req.body;

        const userIndex = users.findIndex(user => user.username === username);
        if (userIndex > -1) {
            const user = users[userIndex];
            if (user.password === password) {

                const userType = user.userType;
                jwt.sign({ username, userType }, secret, (err, token) => {

                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.cookie('token', token);

                        if (userType === 'admin') {
                            res.status(200).sendFile(path.join(__dirname, '/homeAdmin.html'));
                        } else res.status(200).sendFile(path.join(__dirname, '/homeUser.html'));
                    };

                });

            } else res.sendStatus(403);
        } else res.sendStatus(403);

    } else {
        res.sendStatus(400);
    };

});

app.get('/users', (req, res) => { // list registered users if validated (admin or user)
    const { token } = req.cookies;

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
            return false;
        };

        const userList = users.map(user => {
            const { password, ...newUser } = user;
            return newUser;
        })

        res.status(200).send(userList);
        return false;
    })
})

app.post('/users', (req, res) => { // register new user if validated (admin only)
    const { token } = req.cookies;
    const { name } = req.body;
    const { username } = req.body;
    const { password } = req.body;

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
            return false;
        };

        if (decoded.userType === 'admin') {
            users.push({ name, username, password, userType: 'user' });
            res.sendStatus(200);
            return false;
        }

        if (decoded.userType === 'user') {
            res.sendStatus(403);
            return false;
        }

        res.sendStatus(400);
    })
})

app.listen(80);