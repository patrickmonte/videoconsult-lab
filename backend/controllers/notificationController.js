const nodemailer = require('nodemailer');

// Configuração básica para testes (substitua por dados reais em produção)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAppointmentConfirmation(email, date, time) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmação de Agendamento',
    text: `Seu agendamento foi realizado para o dia ${date} às ${time}.` 
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendAppointmentConfirmation };
