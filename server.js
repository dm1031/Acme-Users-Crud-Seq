const { Page, User, syncAndSeed } = require('./db');
const express = require('express');
const app = require('./app');

app.listen(3000, () => {
    console.log('Listening on 3000!');
});

syncAndSeed();
