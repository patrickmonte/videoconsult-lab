const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Logs de acesso para rotas protegidas
const AccessLog = require('./models/AccessLog');
const auth = require('./middleware/auth');
app.use('/api/patients', auth, async (req, res, next) => {
  await AccessLog.create({ user: req.user?.email || req.user?.id, action: 'access_patients', ip: req.ip });
  next();
}, require('./routes/patients'));
app.use('/api/appointments', auth, async (req, res, next) => {
  await AccessLog.create({ user: req.user?.email || req.user?.id, action: 'access_appointments', ip: req.ip });
  next();
}, require('./routes/appointments'));
app.use('/api/exams', auth, async (req, res, next) => {
  await AccessLog.create({ user: req.user?.email || req.user?.id, action: 'access_exams', ip: req.ip });
  next();
}, require('./routes/exams'));
app.use('/api/chat', auth, async (req, res, next) => {
  await AccessLog.create({ user: req.user?.email || req.user?.id, action: 'access_chat', ip: req.ip });
  next();
}, require('./routes/chat'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/videoconsult-lab';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));
