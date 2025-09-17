# Instruções de Execução do Sistema de Vídeoconsulta Laboratorial

## Pré-requisitos
- Node.js 18+
- MongoDB em execução local ou remoto

## 1. Configuração do Backend

1.1. Instale as dependências:
```bash
cd backend
npm install
```

1.2. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:
```bash
cp .env.example .env
```

1.3. Inicie o servidor backend:
```bash
npm start
```
O backend estará disponível em `http://localhost:5000`.

## 2. Configuração do Frontend

2.1. Instale as dependências:
```bash
cd ../frontend
npm install
```

2.2. Gere os arquivos de configuração do Tailwind (se necessário):
```bash
npx tailwindcss init -p
```

2.3. Inicie o frontend:
```bash
npm start
```
O frontend estará disponível em `http://localhost:3000`.

## 3. Fluxo de Uso
- Acesse o frontend e realize o pré-cadastro do paciente.
- Agende uma vídeoconsulta.
- Entre na sala de chamada, utilize a câmera e o scanner de documentos.

## 4. Observações
- Certifique-se de que o MongoDB está rodando.
- O sistema utiliza autenticação JWT para rotas protegidas.
- Para ambiente de produção, configure HTTPS e variáveis seguras.

## 5. Tecnologias
- React.js, Tailwind CSS, Node.js, Express, MongoDB, WebRTC, Tesseract.js, JWT

## 6. Contato
## 7. Deploy em Produção

### Backend
- Configure variáveis de ambiente seguras no servidor (ex: Docker, .env).
- Utilize um gerenciador de processos como PM2 ou Docker para manter o backend ativo.
- Configure HTTPS (Nginx, Caddy ou similar).
- Exemplo com PM2:
```bash
pm2 start server.js --name videoconsult-backend
```

### Frontend
- Gere a build de produção:
```bash
cd frontend
npm run build
```
- Sirva a pasta `build/` com um servidor estático (ex: Nginx, serve, Vercel, Netlify).

### MongoDB
- Recomenda-se usar MongoDB Atlas ou instância protegida em nuvem.

## 8. Testes

### Backend
- Testes unitários podem ser implementados com Jest ou Mocha.
- Exemplo de script de teste (adicionar em `backend/package.json`):
```json
"scripts": {
	"test": "jest"
}
```
- Para rodar:
```bash
cd backend
npm test
```

### Frontend
- Testes podem ser feitos com React Testing Library e Jest.
- Exemplo de script de teste (adicionar em `frontend/package.json`):
```json
"scripts": {
	"test": "react-scripts test"
}
```
- Para rodar:
```bash
cd frontend
npm test
```

## 9. Integração

- O frontend se comunica com o backend via REST (`/api`).
- Para integração com sistemas externos (laboratórios, SMS, e-mail), utilize APIs e serviços de terceiros.
- Para autenticação, utilize JWT conforme implementado no backend.
- Para deploy integrado, utilize ferramentas como Docker Compose para orquestrar frontend, backend e banco de dados.

Dúvidas ou sugestões: patrickmonte
