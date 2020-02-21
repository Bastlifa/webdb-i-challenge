const express = require('express')
const db = require('../data/dbConfig.js');

const router = express.Router()

router.get('/', (req, res) =>
{
    const queryObj = req.query
    const limit = queryObj.limit || 'All'
    const sortby = queryObj.sortby || 'id'
    const sortdir = queryObj.sortdir || 'asc'
    
    // let query = db('accounts')

        // if(queryObj.sortby)
        // {
        //     if(queryObj.sortdir) query.orderBy(queryObj.sortby, queryObj.sortdir)
        //     else query.orderBy(queryObj.sortby)
        // }
        // if (queryObj.limit) query.limit(Number(queryObj.limit))
        
        db('accounts')
            .orderBy(sortby, sortdir)
            .limit(limit)
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ errorMessage: "Internal Error: failed to retrieve accounts" })
            })
})

router.get('/:id', (req, res) =>
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

router.post('/', (req, res) =>
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

router.delete('/:id', (req, res) =>
{
    const id = req.params.id
    db('accounts')
        .where({id}).del()
            .then(response =>
                {
                    if(response)
                    {
                        res.status(200).json({ message: `deleted ${response} accounts` })
                    }
                    else
                    {
                        res.status(404).json({ errorMessage: `Could not find account with id ${id}` })
                    }
                })
            .catch(err =>
                {
                    res.status(500).json({ errorMessage: `Internal Error: Could not delete ` })
                })
})

router.put('/:id', (req, res) =>
{
    const changes = req.body
    const id = req.params.id
    db('accounts')
        .where({id}).update(changes)
            .then(response =>
                {
                    if(response)
                    {
                        res.status(200).json({ message: `updated ${response} accounts` })
                    }
                    else
                    {
                        res.status(404).json({ errorMessage: `Could not find account with id ${id}` })
                    }
                })
            .catch(err =>
                {
                    res.status(500).json({ errorMessage: `Internal Error: Could not delete ` })
                })
})

module.exports = router