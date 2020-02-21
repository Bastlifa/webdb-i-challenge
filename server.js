const express = require('express');

const accountRouter = require('./accounts/accountRouter')

const server = express();

server.use(express.json());

server.use('/api/accounts', accountRouter)

server.get('/', (req, res) => {
    res.send('You got to /');
});

module.exports = server;