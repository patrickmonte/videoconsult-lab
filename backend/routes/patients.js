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

// Listar todos os pacientes
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar paciente
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado.' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Buscar paciente por ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado.' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
