// Exemplo usando Twilio (https://www.twilio.com/)
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Configuração do Twilio ausente.');
  }
  return client.messages.create({
    body: message,
    from: fromNumber,
    to
  });
}

module.exports = { sendSMS };
