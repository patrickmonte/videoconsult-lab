const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const exam = new Exam({
      patientId: req.user.id,
      documentText: text,
      status: 'pending'
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
