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

router.post('/events/create', verify, async (req, res) => {
  const { error } = eventValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body.date)

  const event = new Event({
    name: req.body.name,
    user: req.user._id,
    date: new Date(req.body.date)
  })

  console.log(event.date)

  try {
    const savedEvent = await event.save();
    res.status(200).redirect('/events');
  } catch (err) {
    res.status(400).send(err);
  }
})

router.get('/events/delete/:id', verify, async (req, res) => {
  const event = await Event.findById(req.params.id)

  try {
    const deleteEvent = event.deleteOne();
    res.status(200).redirect('/events');
  } catch(err) {
    res.send(err);
  }
})

module.exports = router;
