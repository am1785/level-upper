const express = require('express')
const router = express.Router()

const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const {title, link, content, skills, status, exp, recurring, author} = req.body;

    try {
        const task = await Task.create({title, link, content, skills, status, exp, recurring, author})
        res.status(200).json(task)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
});

// get all recent tasks from an author / user
router.get('/tasks/:author', async (req, res) => {
    try {
        const tasks = await Task.find({author: req.params.author}).limit(24).sort([['_id', -1]])
        // .limit( 24 )
        // .sort( '-createdOn' )
        res.status(200).json(tasks)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

module.exports = router;