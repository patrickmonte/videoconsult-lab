const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const AccessLog = require('../models/AccessLog');

// Limite de tentativas de login por IP (simples, memória)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos

router.post('/login', async (req, res) => {
  const { email, cpf } = req.body;
  const ip = req.ip;
  const now = Date.now();

  // Limitar tentativas
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip] = loginAttempts[ip].filter(ts => now - ts < BLOCK_TIME);
  if (loginAttempts[ip].length >= MAX_ATTEMPTS) {
    return res.status(429).json({ message: 'Muitas tentativas. Tente novamente mais tarde.' });
  }

  const patient = await Patient.findOne({ email, cpf });
  if (!patient) {
    loginAttempts[ip].push(now);
    await AccessLog.create({ user: email, action: 'login_failed', ip });
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: patient._id, email: patient.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '2h' });
  await AccessLog.create({ user: email, action: 'login_success', ip });
  res.json({ token, patient });
});

module.exports = router;
