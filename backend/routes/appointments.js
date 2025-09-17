// Reagendar consulta
router.put('/:id/reschedule', auth, async (req, res) => {
  try {
    const { date, time } = req.body;
    // Verificar conflito
    const conflict = await Appointment.findOne({ date, time });
    if (conflict) return res.status(409).json({ message: 'Horário já agendado.' });
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time },
      { new: true, runValidators: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancelar consulta
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    res.json({ message: 'Agendamento cancelado.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const { sendAppointmentConfirmation } = require('../controllers/notificationController');
const { sendSMS } = require('../controllers/smsController');


router.post('/', auth, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = new Appointment({
      patientId: req.user.id,
      date,
      time
    });
    await appointment.save();
    // Buscar e-mail do paciente
    const patient = await Patient.findById(req.user.id);
    if (patient) {
      // E-mail
      if (patient.email) {
        try {
          await sendAppointmentConfirmation(patient.email, date, time);
        } catch (e) {
          console.error('Erro ao enviar e-mail:', e.message);
        }
      }
      // SMS
      if (patient.phone) {
        try {
          await sendSMS(patient.phone, `Seu agendamento foi realizado para o dia ${date} às ${time}.`);
        } catch (e) {
          console.error('Erro ao enviar SMS:', e.message);
        }
      }
    }
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verificar conflito de horário
router.post('/check-conflict', async (req, res) => {
  const { date, time } = req.body;
  const conflict = await Appointment.findOne({ date, time });
  res.json({ conflict: !!conflict });
});

module.exports = router;
