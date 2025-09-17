const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
