const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', (req, res) =>
{
    db('accounts')
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ errorMessage: "Internal Error: failed to retrieve accounts" })
            })
})

server.get('/accounts/:id', (req, res) =>
{
    const id = req.params.id
    db('accounts').where({id})
        .then(response =>
            {
                if(response && response.length > 0)
                {
                    res.status(200).json(response)
                }
                else
                {
                    res.status(404).json({ errorMessage: "No such account" })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: `Could not get account` })
            })
})

server.post('/accounts', (req, res) =>
{
    if(!req.body.name || !req.body.budget)
    {
        res.status(400).json({ errorMessage: "Please make sure name and body are present" })
    }
    else
    {
        db('accounts').insert(req.body)
            .then(response =>
                {
                    res.status(201).json(response)
                })
            .catch(error =>
                {
                    res.status(500).json({ errorMessage: `Could not post account` })
                })
    }
})

module.exports = server;