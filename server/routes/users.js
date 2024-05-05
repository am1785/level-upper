const express = require('express');
const router = express.Router();
const checkAuth = require('../routes/auth').checkAuth;
const User = require('../models/user');
const Task = require('../models/task');

// get all data for a single user based on _id, without password
router.get('/users/:_id', checkAuth, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params._id}, '-password')
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
})

// update an existing user by id
router.put('/users/:_id', checkAuth, async (req, res) => {
    const userId = req.params._id;
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'unauthorized' });
    }
    const updatedUserData = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate({_id: userId}, updatedUserData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// delete an existing user and all associated data by id, and log out
router.delete('/users/:_id', checkAuth, async (req, res) => {
  const userId = req.params._id;
  if (req.user.id === userId || req.user.role >= 3) {
    try {
      const deletedTasks = await Task.deleteMany({author: userId});
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.logout(function(err) {
        if (err) { return next(err); }
        return res.status(200).json({msg: "user deleted"});
    });

    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  else {return res.status(403).json({ error: 'unauthorized' })};
});
  module.exports = router;
