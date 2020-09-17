const express = require('express');
const verify = require('../services/verifyToken');
const eventValidation = require('../services/eventValidation');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/events', verify, async (req, res) => {
  const userSession = req.user._id;

  const events = await Event.find({
    user: req.user._id
  })

  res.render('events', { events })
})

router.post('/events/api/create', verify, async (req, res) => {
  const { error } = eventValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const event = new Event({
    name: req.body.name,
    user: req.user._id,
    date: new Date(req.body.date)
  })

  try {
    const savedEvent = await event.save();
    res.send(savedEvent._id);
  } catch (err) {
    res.status(400).send(err);
  }
})

module.exports = router;
