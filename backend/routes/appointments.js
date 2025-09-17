const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = new Appointment({
      patientId: req.user.id,
      date,
      time
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
