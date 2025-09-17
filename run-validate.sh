#!/bin/bash
# Script de automação para subir o ambiente completo do videoconsult-lab
# Uso: ./run-validate.sh

set -e

# 1. Build e start dos containers

echo "[1/3] Subindo containers com Docker Compose..."
docker-compose up -d --build

# 2. Aguarda serviços subirem

echo "[2/3] Aguardando backend responder..."
for i in {1..20}; do
  if curl -s http://localhost:5000/api/patients > /dev/null; then
    echo "Backend online!"
    break
  fi
  sleep 2
done

# 3. Testes automatizados backend

echo "[3/4] Executando testes automatizados do backend..."
docker-compose exec backend npm test || {
  echo "[ERRO] Testes do backend falharam."; exit 1;
}

# 4. Testes automatizados frontend

echo "[4/4] Executando testes automatizados do frontend..."
docker-compose exec frontend npm test -- --watchAll=false || {
  echo "[ERRO] Testes do frontend falharam."; exit 1;
}

echo "\n[SUCCESS] Ambiente validado com sucesso!"
echo "Acesse o frontend em http://localhost:3000"
echo "Documentação: veja o arquivo INSTRUCOES.md ou acesse http://localhost:3000 para navegar pelo sistema."
