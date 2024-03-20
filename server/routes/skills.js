const express = require('express')
const router = express.Router()

const Task = require('../models/task');

// get all skills data from an author / user, filtered by collection
router.get('/skills/:author', async (req, res) => {
    let pipeline = [
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

      // add collection filter during match stage
      if(req.query && req.query.collection) {
        pipeline = [
          {
            $match:
              {
                author: req.params.author,
                status: "complete",
                task_collection: req.query.collection
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
      }

      try {
        const skills = await Task.aggregate(pipeline);

        res.status(200).json(skills)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

module.exports = router;