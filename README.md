videoconsult-lab/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── VideoCall.js
│       │   ├── PatientForm.js
│       │   ├── DocumentScanner.js
│       │   └── ...
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Appointment.js
│       │   ├── CallRoom.js
│       │   └── ...
│       ├── App.js
│       └── index.js
├── backend/
│   ├── routes/
│   │   ├── patients.js
│   │   ├── appointments.js
│   │   └── exams.js
│   ├── controllers/
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   └── examController.js
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   └── Exam.js
│   └── server.js
└── package.json

# Sistema de Videoconsulta Laboratorial

## Visão Geral
Plataforma completa para atendimento remoto de exames laboratoriais, com pré-cadastro, agendamento, vídeochamada, chat, upload/OCR de documentos, painel administrativo, notificações e relatórios exportáveis.

## Principais Funcionalidades
- Pré-cadastro e edição de pacientes
- Agendamento inteligente de consultas (evita conflitos, confirmações por e-mail/SMS)
- Sala de vídeochamada com:
  - Chat textual integrado
  - Compartilhamento de tela
  - Upload e OCR de documentos (Tesseract.js)
  - Gravação opcional (apenas atendente)
  - Interface adaptada para paciente e atendente
- Painel administrativo (atendente/médico):
  - Abas para consultas, pacientes, exames, notificações e relatórios
  - Filtros, exportação CSV, histórico detalhado
  - Visualização e navegação rápida entre pacientes, exames e consultas
- Notificações automáticas (e-mail/SMS)
- Segurança: autenticação JWT, recomendações de HTTPS, consentimento para gravação

## Tecnologias Utilizadas
- **Frontend**: React.js, Tailwind CSS, WebRTC, Tesseract.js
- **Backend**: Node.js, Express, MongoDB, JWT, Nodemailer, Twilio

## Estrutura do Projeto
```
videoconsult-lab/
  frontend/
    src/
      components/
        VideoCall.js
        PatientForm.js
        DocumentScanner.js
        Chat.js
      pages/
        Appointment.js
        CallRoom.js
        attendant/
          Dashboard.js
          PatientList.js
          PatientHistory.js
          ChatRoom.js
          ExamRequest.js
      App.js
  backend/
    models/
      Patient.js
      Appointment.js
      Exam.js
      ChatMessage.js
    routes/
      patients.js
      appointments.js
      exams.js
      chat.js
    controllers/
      notificationController.js
      smsController.js
    middleware/
      auth.js
    server.js
  docker-compose.yml
  README.md
  INSTRUCOES.md
```

## Fluxo do Usuário
1. Paciente realiza pré-cadastro e agenda consulta
2. Recebe confirmação (e-mail/SMS)
3. Acessa sala de vídeochamada (com chat, upload/OCR, compartilhamento de tela)
4. Atendente pode gravar a consulta (com consentimento)
5. Após consulta, exames e histórico ficam disponíveis no painel

## Painel Administrativo
- Abas: Consultas, Pacientes, Exames, Notificações, Relatórios
- Filtros por data/status, exportação CSV
- Acesso rápido ao histórico do paciente, chat e sala de chamada

## Segurança e Privacidade
- Autenticação JWT
- Consentimento para gravação
- Recomendações de HTTPS e LGPD

## Melhorias Futuras
- Integração com laboratórios
- Pagamento online
- Chat assíncrono pós-consulta
- IA para análise de exames

## Execução e Deploy
Veja `INSTRUCOES.md` para detalhes de instalação, execução local, testes, deploy cloud, HTTPS e CI/CD.

### 1. Pré-Cadastro do Paciente (frontend/src/components/PatientForm.js)

```jsx
import React, { useState } from 'react';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enviar dados para o backend
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Cadastro realizado com sucesso!');
      // Redirecionar para agendamento
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700">Nome Completo</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      {/* Outros campos similares */}
      
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Cadastrar
      </button>
    </form>
  );
};
```

### 2. Agendamento de Vídeoconsulta (frontend/src/pages/Appointment.js)

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleSchedule = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ date, time })
    });

    if (response.ok) {
      navigate(`/call-room?date=${date}&time=${time}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Agendar Consulta</h2>
      <div className="flex flex-col space-y-4">
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <input 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button 
          onClick={handleSchedule}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Agendar
        </button>
      </div>
    </div>
  );
};
```

### 3. Sala de Chamada com Scanner de Documentos (frontend/src/components/VideoCall.js)

```jsx
import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import Tesseract from 'tesseract.js';

const VideoCall = ({ match }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Inicializar webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  // Configurar WebRTC
  useEffect(() => {
    const peer = new SimplePeer({ initiator: true, stream: localStream });

    peer.on('signal', data => {
      // Enviar sinal para o servidor
    });

    peer.on('stream', stream => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    // Conectar ao médico (simulado)
    setTimeout(() => {
      peer.signal(/* sinal recebido do servidor */);
    }, 1000);
  }, [localStream]);

  // Função para escanear documento
  const scanDocument = async () => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Capturar imagem da câmera
      canvas.width = localVideoRef.current.videoWidth;
      canvas.height = localVideoRef.current.videoHeight;
      context.drawImage(localVideoRef.current, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Usar Tesseract para reconhecer texto
      const result = await Tesseract.recognize(imageDataUrl, 'por');
      setDocumentText(result.data.text);
      
      // Enviar texto para o backend
      await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.data.text })
      });
    } catch (error) {
      console.error('Erro no reconhecimento:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow relative">
        <video ref={localVideoRef} autoPlay muted className="absolute top-4 left-4 w-48 h-36 object-cover" />
        <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="bg-red-500 text-white p-3 rounded-full">
            <i className="fas fa-video"></i>
          </button>
          <button className="bg-blue-500 text-white p-3 rounded-full">
            <i className="fas fa-microphone"></i>
          </button>
          <button onClick={scanDocument} className="bg-green-500 text-white p-3 rounded-full">
            <i className="fas fa-camera"></i>
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 shadow-lg max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Texto Reconhecido:</h3>
        <pre className="text-sm">{documentText}</pre>
      </div>
    </div>
  );
};
```

### 4. Backend - Modelos de Dados (backend/models/Patient.js)

```javascript
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  birthDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
```

### 5. Backend - Rota de Exames (backend/routes/exams.js)

```javascript
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const exam = new Exam({
      patientId: req.user.id,
      documentText: text,
      status: 'pending'
    });
    
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Outras rotas...

module.exports = router;
```

## Funcionalidades Adicionais

1. **Sistema de Autenticação**:
   ```javascript
   // middleware/auth.js
   const jwt = require('jsonwebtoken');
   
   module.exports = function(req, res, next) {
     const token = req.header('x-auth-token');
     if (!token) return res.status(401).send('Acesso negado.');
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (ex) {
       res.status(400).send('Token inválido.');
     }
   };
   ```

2. **Notificações**:
   - Envio de SMS/email para confirmação de agendamento
   - Lembretes antes da consulta

3. **Relatórios Pós-Atendimento**:
   - Geração de PDF com resumo da consulta
   - Lista de exames solicitados

4. **Interface Administrativa**:
   - Painel para médicos visualizarem consultas
   - Histórico de exames solicitados

## Considerações de Segurança

1. **Criptografia**:
   - Comunicação HTTPS
   - Armazenamento seguro de dados sensíveis

2. **Privacidade**:
   - Consentimento explícito para gravação de vídeo
   - Anonimização de dados quando possível

3. **Compliance**:
   - LGPD/Lei Geral de Proteção de Dados
   - HIPAA (se aplicável)

## Melhorias Futuras

1. Integração com sistemas de laboratórios
2. Pagamento online para exames
3. Chat assíncrono para suporte pós-consulta
4. IA para análise preliminar de resultados

Este sistema proporciona uma solução completa para o processo de solicitação de exames laboratoriais, combinando conveniência para o paciente com eficiência para os profissionais de saúde.