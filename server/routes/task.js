const express = require('express')
const router = express.Router()

const Task = require('../models/task')

router.post('/task/add', async (req, res) => {
    const {title, link, content, tags, status, exp, recurring, author} = req.body;

    try {
        const task = await Task.create({title, link, content, tags, status, exp, recurring, author})
        res.status(200).json(task)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})