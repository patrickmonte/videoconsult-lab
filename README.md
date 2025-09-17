# 💻 Sistema de Videoconsulta Laboratorial

Plataforma moderna para atendimento remoto de exames laboratoriais, integrando pacientes e profissionais de saúde em um ambiente seguro, acessível e eficiente.

---

## Funcionalidades

- Pré-cadastro e edição de pacientes
- Agendamento inteligente de consultas (com confirmação por e-mail/SMS)
- Sala de vídeochamada com chat, upload/OCR de documentos, compartilhamento de tela e gravação (apenas atendente)
- Painel administrativo com abas para consultas, pacientes, exames, notificações e relatórios exportáveis
- Notificações automáticas e histórico completo
- Segurança: autenticação JWT, HTTPS, consentimento para gravação

---

## Como Usar

### Paciente
1. Faça seu pré-cadastro na plataforma
2. Agende uma consulta em um horário disponível
3. No horário marcado, acesse a sala de vídeochamada (permita câmera/microfone)
4. Utilize o chat e envie documentos quando solicitado
5. Consulte seu histórico e exames após o atendimento

### Atendente/Médico
1. Acesse o painel administrativo
2. Gerencie consultas, pacientes, exames e notificações
3. Inicie chamadas, converse via chat, acesse históricos e exporte relatórios
4. Grave consultas (com consentimento) e utilize filtros avançados

---

## Estrutura do Projeto

```text
videoconsult-lab/
  frontend/
    src/components/
    src/pages/
    [App.js](http://_vscodecontentref_/1)
  backend/
    models/
    routes/
    controllers/
    middleware/
    server.js
  [docker-compose.yml](http://_vscodecontentref_/2)
  [README.md](http://_vscodecontentref_/3)
  [INSTRUCOES.md](http://_vscodecontentref_/4)