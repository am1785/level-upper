const express = require('express');
const router = express.Router();

const Task = require('../models/task');

router.delete('/backlog', async (req, res) => {
    try {
        const taskIds = req.body.task_ids;

        // // Use Mongoose to find and remove the tasks by its _id
        const deletedTasks = await Task.deleteMany({_id: { $in: taskIds}});

        if (!deletedTasks) {
            // If the task with the specified _id is not found
            return res.status(404).json({ error: 'Tasks not found' });
        }

        // If the task is successfully deleted
        res.status(200).json({ message: 'Tasks deleted successfully'});
    } catch (err) {
        // If an error occurs during the deletion process
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;
