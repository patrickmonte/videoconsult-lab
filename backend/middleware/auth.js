const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
  if (!token) return res.status(401).send('Acesso negado.');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Token inválido.');
  }
};
