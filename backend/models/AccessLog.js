const mongoose = require('mongoose');

const AccessLogSchema = new mongoose.Schema({
  user: { type: String },
  action: { type: String },
  ip: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccessLog', AccessLogSchema);
