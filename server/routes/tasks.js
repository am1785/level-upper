const express = require('express')
const router = express.Router()

const Task = require('../models/task');
// const Skillset = require('../models/skillset');

router.post('/tasks', async (req, res) => {
    const {title, link, content, skills, status, exp, recurring, author} = req.body;

    try {
        const task = await Task.create({title, link, content, skills, status, exp, recurring, author})
        res.status(200).json({ message: 'Task added successfully', task })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
});

// get all recent tasks from an author / user
router.get('/tasks/:author', async (req, res) => {
    try {
        // console.log('an incoming request');
        // console.log(req.rawHeaders);
        // console.log('-----------');

        // req.query.page ? console.log(`page: ${req.query.page}`) : console.log('page not found');
        let tasks = []
        if(req.query.all) {
            tasks = await Task.find({author: req.params.author}).sort([['_id', -1]])
        } else {
            tasks = await Task.find({author: req.params.author}).limit(48).sort([['_id', -1]])
        }
        res.status(200).json(tasks)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// edit an existing task
router.put('/tasks/:_id', async (req, res) => {
    const taskId = req.params._id;
    const updatedTaskData = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

      // logic for updating user skill set when a status change is detected
    //   if (updatedTask.status !== updatedTaskData.status) {
    //     if (updatedTask.status === "complete") {
    //         try {
    //             Skillset.findOne({user: updatedTask.author}, function (err, result) {
    //                 if(!result) {
    //                     Skillset.create({user:updatedTask.author, total_exp: 0, skills: []});
    //                 }
    //             });
    //             Skillset.update(
    //                 { user: updatedTask.author },
    //                 { $inc: { total_exp: updatedTask.exp } },
    //                 { $push: { skills: updatedTask.skills } }
    //             );
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     } else {
    //         try {

    //         } catch(err) {
    //             console.log(err);
    //         }
    //     }
    //   }

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