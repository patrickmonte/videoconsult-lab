const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// Buscar mensagens de uma sala
router.get('/:roomId', async (req, res) => {
  const messages = await ChatMessage.find({ roomId: req.params.roomId }).sort('timestamp');
  res.json(messages);
});

// Enviar mensagem
router.post('/:roomId', async (req, res) => {
  const { sender, content } = req.body;
  const message = new ChatMessage({ roomId: req.params.roomId, sender, content });
  await message.save();
  res.status(201).json(message);
});

module.exports = router;
