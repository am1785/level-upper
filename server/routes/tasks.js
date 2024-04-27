const express = require('express')
const router = express.Router()

const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
    const {title, link, content, skills, status, exp, hidden, author, recurring} = req.body;

    if(recurring && recurring.length > 0) {
        res.status(200).json({message: 'Task added successfully'});
    } else {
    try {
        const task = await Task.create({title, link, content, skills, status, exp, hidden, author})
        res.status(200).json({ message: 'Task added successfully', task })
    } catch (err) {
        res.status(400).json({error: err.message})
        }
    }
});

// get all recent tasks from an author / user, without content
router.get('/tasks/:author', async (req, res) => {
    try {
        let tasks = [];
        if(req.query.all) {
            tasks = await Task.find({author: req.params.author}, '-content').sort([['_id', -1]]);
        } else {
            tasks = await Task.find({author: req.params.author, updatedAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // get tasks within 7 days
                $lt: new Date()
            }, hidden: false}, '-content').limit(150).sort([['_id', -1]]);
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
})

// get all distinct collections from a user
router.get('/tasks/collections/:author', async (req, res) => {
    try {
        const collections = await Task.distinct("task_collection", {author: req.params.author});
        res.status(200).json(collections);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// get all data for a single task based on task _id
router.get('/tasks/view/:_id', async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params._id})
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
})

// edit an existing task
router.put('/tasks/:_id', async (req, res) => {
    const taskId = req.params._id;
    const updatedTaskData = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/tasks/:_id', async (req, res) => {
    try {
        const taskId = req.params._id;

        // Use Mongoose to find and remove the task by its _id
        const deletedTask = await Task.find({_id: taskId}).deleteOne();

        if (!deletedTask) {
            // If the task with the specified _id is not found
            return res.status(404).json({ error: 'Task not found' });
        }

        // If the task is successfully deleted
        res.status(200).json({ message: 'Task deleted successfully', deletedTask });
    } catch (err) {
        // If an error occurs during the deletion process
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;