const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const registeredUsers = require('./registered_users.json');
let loginUser = false;

const app = express();
const filePath = path.join(process.cwd(), 'registered_users.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'view')));

app.set('view engine', '.hbs');
app.engine('.hbs', hbs({ defaultLayout: false }));

app.set('views', path.join(process.cwd(), 'view'));

app.get('/', (req, res) => {
    res.render('registration');
});
app.get('/error', (req, res) => {
    res.render('error', { errMsg });
});
app.get('/users', (req, res) => {
    if (loginUser) {
        return res.render('users', { registeredUsers, loginUser });
    } 
        res.redirect('/error');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/registration', (req, res) => {
    const { userName, email, password } = req.body;
        registeredUsers.forEach((user) => {
        if (user.userName === userName || user.email === email) {
            errMsg = 'This email address or username belongs to a registered user';
            res.redirect('/error');           
        }
    });
    registeredUsers.push({ userName, email, password });
    const newUsers = JSON.stringify(registeredUsers);
    fs.writeFile(filePath, newUsers, err => {
        if (err) {
            throw err;
        }
    })
        loginUser = true;
        res.redirect('/users');        
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    registeredUsers.forEach((user) => {
        if (user.email === email && user.password === password) {
            loginUser = true;
            res.redirect('/users');
        }
    });
    errMsg = 'You entered wrong email or password during login';
    res.redirect('/error');
});
app.post('/logout', (req, res) => {
    loginUser = false;
    res.redirect('/login');
});

app.listen(3000);
