const express = require('express');
const router = express.Router();
const checkAuth = require('../routes/auth').checkAuth;
const Task = require('../models/task');

router.delete('/backlog', checkAuth, async (req, res) => {
    // delete many tasks from the backlog
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
});

router.put('/backlog', checkAuth, async (req, res) => {
    // update collections for many tasks
    try {
        const taskIds = req.body.task_ids;
        const taskCollection = req.body.task_collection;
        const operation = req.body.operation;

        if(!operation || !taskCollection || !taskIds) {
            return res.status(403).json({ error: 'not allowed' });
        }

        if (operation === "add_col_to_set") {
            // Use Mongoose to find and edit the tasks by its _id
            const editedTasks = await Task.updateMany({"_id": { "$in": taskIds}}, {"$addToSet":{"task_collection": taskCollection}});

            if (!editedTasks) {
                // If the tasks with the specified _ids are not found
                return res.status(404).json({ error: 'Tasks not found' });
            }

            // If the tasks are successfully edited
            res.status(200).json({ message: 'Tasks edited successfully'});
        } else if (operation === "pull_col_from") {
            const editedTasks = await Task.updateMany({"_id": { "$in": taskIds}}, {"$pull": {"task_collection": taskCollection}});

            if (!editedTasks) {
                // If the tasks with the specified _ids are not found
                return res.status(404).json({ error: 'Tasks not found' });
            }

            // If the tasks are successfully edited
            res.status(200).json({ message: 'Tasks edited successfully'});
        } else {
            return res.status(403).json({ error: 'not allowed' });
        }

    } catch (err) {
        // If an error occurs during the edit process
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
