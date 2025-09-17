const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  documentText: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);
