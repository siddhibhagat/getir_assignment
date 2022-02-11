"use strict";
const Joi = require('joi').extend(require('@joi/date'));
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Records = mongoose.model('Record', new mongoose.Schema({
  key: String,
  createdAt: Date,
  counts: Array,
  value: String
}));

router.post('/getRecords', async (req, res) => {
  try {
    const {error} = validateRequestData(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const minCount = req.body.minCount;
    const maxCount = req.body.maxCount;
    const records = await Records.aggregate([
      {
        $match: {
          createdAt:{
            $gte:new Date(startDate),
            $lt:new Date(endDate)
          }
        }
      },
      { $redact: {
        $cond: {
            if: {
              $and: [
                { $gt: [ { $sum: "$counts" }, minCount ] },
                {$lt: [ { $sum: "$counts" }, maxCount] }
              ]
            },
            then: "$$DESCEND",
            else: "$$PRUNE"
          }
        }
      },
      {
        $project: {
          _id: 0,
          key: 1,
          createdAt: 1,
          totalCount: { $sum: "$counts"}
        }
      }
    ]);
    const data = {
      code: 0,
      msg: "Success",
      records,
    }
    res.send(data);
  } catch(err) {
    console.log(err)
  }
})

const validateRequestData = (data) => {
  const schema = Joi.object({
    startDate: Joi.date().format('YYYY-MM-DD').required(),
    endDate: Joi.date().format('YYYY-MM-DD').required(),
    minCount: Joi.number().integer().strict().required(),
    maxCount: Joi.number().integer().strict().required()
  });
  return schema.validate(data);
}

module.exports = router;