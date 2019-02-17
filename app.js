const express = require('express');
const methodOverride = require('method-override')
const { Page, User, syncAndSeed } = require('./server')

const app = express();

syncAndSeed();

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
        res.send(`
    <html>
    <head>
    </head>
    <body>
    <ul>
        ${users.map((user) => {
            return `<li>
            <a href='/users/${user.id}'>
            ${user.name}
            </a>

            <form method='post' action='/users/${user.id}/?_method=delete'>
            <button>Delete</button>
            </form>
            </li>`
            
        }).join('')
    }
        <form method = 'post' action='/users'>
        <input type='text' name='firstname'>
        <input type='text' name='lastname'>
        <button>Create</button>
        </form>
    </body>
    </html>`)
    })
    .catch(next);
    
})

app.post('/users', (req, res, next) => {
    User.create({
        name: `${req.body.firstname}  ${req.body.lastname}`
    })
    .then((user) => {
        res.redirect('/users');
    })
    .catch(next);
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
    
})







app.listen(3000, () => {
    console.log('Listening on 3000!');
});

