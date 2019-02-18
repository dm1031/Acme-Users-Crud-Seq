const express = require('express');
const methodOverride = require('method-override');
const { Page, User, syncAndSeed } = require('./db');
const ejs = require('ejs');
const app = express();

module.exports = app;

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    Page.findOne({
        where: {
            isHomePage: true
        } 
    })
    .then((page) => {
        res.redirect('/users');
    })
})

app.get('/users', (req, res, next) => {
    User.findAll()
    .then((users) => {
        res.render('index', { users })
    })
    .catch(next);
})

app.post('/users', (req, res, next) => {
    //if a user exists, update it.
    if (req.body.id) {

        User.findOne({
            where: {
                id: req.body.id
            }
        })
        .then((userToUpdate) => {
            userToUpdate.update({
                first: req.body.firstname,
                last: req.body.lastname
            })
        })
        .then(() => {
            res.redirect('/users')
        })
        .catch(next);
    //if a user does not yet exist, create it.
    } else {

        User.create({
            first: req.body.firstname,
            last: req.body.lastname
        })
        .then(() => {
            res.redirect('/users');
        })
        .catch(next);
    }
})

app.delete('/users/:id', (req, res, next) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(() => {
        res.redirect('/users');
    })
    .catch(next);
})

app.put('/users/:id', (req, res, next) => {
    Promise.all([
        User.findAll(),
        User.findOne({
            where: {
                id: req.params.id
            }
        })
    ])
    .then(([users, userToUpdate]) =>
        res.render('index_update', { users, userToUpdate }))
    .catch(next);
})

//in the post route, if a user has an existing id, update it. If not, create it.
