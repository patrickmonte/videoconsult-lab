const request = require('supertest');
const express = require('express');
const patientRouter = require('../routes/patients');

describe('Patient API', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/patients', patientRouter);
  });

  it('deve cadastrar um paciente', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        name: 'Teste',
        cpf: '12345678900',
        email: 'teste@teste.com',
        phone: '11999999999',
        birthDate: '2000-01-01'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Teste');
  });
});
