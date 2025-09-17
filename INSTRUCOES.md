
# Instruções de Execução — Videoconsulta Laboratorial

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
- Acesse o frontend e realize o pré-cadastro do paciente
- Agende uma vídeoconsulta (com confirmação por e-mail/SMS)
- Entre na sala de chamada:
	- Utilize a câmera, chat textual, upload/OCR de documentos, compartilhamento de tela
	- Se for atendente, pode gravar a consulta (com consentimento)
- Após a consulta, utilize o painel administrativo para:
	- Visualizar consultas, pacientes, exames, notificações e relatórios exportáveis
	- Navegar rapidamente entre histórico, chat e sala de chamada


## 4. Observações
- Certifique-se de que o MongoDB está rodando
- O sistema utiliza autenticação JWT para rotas protegidas
- Para produção, configure HTTPS, variáveis seguras e consentimento para gravação
- O painel administrativo possui abas para consultas, pacientes, exames, notificações e relatórios
- Apenas o atendente pode gravar a consulta


## 5. Tecnologias
- React.js, Tailwind CSS, Node.js, Express, MongoDB, WebRTC, Tesseract.js, JWT, Nodemailer, Twilio

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
- O frontend se comunica com o backend via REST (`/api`)
- Para integração com sistemas externos (laboratórios, SMS, e-mail), utilize APIs e serviços de terceiros
- Para autenticação, utilize JWT conforme implementado no backend
- Para deploy integrado, utilize Docker Compose para orquestrar frontend, backend e banco de dados
- O painel administrativo permite exportação de relatórios e navegação entre módulos

Dúvidas ou sugestões: patrickmonte

---


## 10. Exemplos para Deploy Cloud, CI/CD e HTTPS

### Deploy Cloud (Vercel/Netlify para Frontend)
- Faça build do frontend:
	```bash
	cd frontend
	npm run build
	```
- Faça upload da pasta `build/` para Vercel, Netlify ou outro serviço estático.
- Configure a variável de ambiente `REACT_APP_API_URL` se necessário.

### Deploy Backend (Heroku, Railway, Render)
- Crie um projeto e conecte o repositório.
- Configure variáveis de ambiente (`MONGO_URI`, `JWT_SECRET`, `PORT`).
- O serviço detecta automaticamente o `backend/Dockerfile` ou `server.js`.

### HTTPS com Nginx (Exemplo)
# Recomendações de Segurança
- Sempre utilize HTTPS em produção
- Garanta consentimento explícito para gravação de vídeo
- Siga as melhores práticas de LGPD
```nginx
server {
		listen 443 ssl;
		server_name seu_dominio.com;
		ssl_certificate /etc/letsencrypt/live/seu_dominio.com/fullchain.pem;
		ssl_certificate_key /etc/letsencrypt/live/seu_dominio.com/privkey.pem;

		location /api/ {
				proxy_pass http://backend:5000/api/;
				proxy_set_header Host $host;
				proxy_set_header X-Real-IP $remote_addr;
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
				proxy_set_header X-Forwarded-Proto $scheme;
		}
		location / {
				root   /usr/share/nginx/html;
				try_files $uri /index.html;
		}
}
```
- Use [Let's Encrypt](https://letsencrypt.org/) para certificados gratuitos.

### CI/CD (GitHub Actions)
Exemplo de workflow `.github/workflows/ci.yml`:
```yaml
name: CI
on:
	push:
		branches: [main]
jobs:
	build-and-test:
		runs-on: ubuntu-latest
		services:
			mongo:
				image: mongo:6
				ports: [27017:27017]
		steps:
			- uses: actions/checkout@v3
			- name: Backend install & test
				run: |
					cd backend
					npm install
					npm test
			- name: Frontend install & test
				run: |
					cd frontend
					npm install
					npm test
```
