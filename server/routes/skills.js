const express = require('express')
const router = express.Router()

const Task = require('../models/task');

// get all skills data from an author / user
router.get('/skills/:author', async (req, res) => {
    const pipeline = [
        {
          $match:
            {
              author: req.params.author,
              status: "complete"
            }
        },
        {
          $unwind:
            "$skills"
        },
        {
          $group:
            {
              _id: "$skills",
              count: {
                $sum: 1
              },
              exp_earned: {
                $sum: "$exp"
              }
            }
        }
      ]

      try {
        const skills = await Task.aggregate(pipeline);

        res.status(200).json(skills)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

module.exports = router;