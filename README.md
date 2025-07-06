# Raffiner Backend API

API REST desenvolvida com Node.js e Express.

## 🚀 Como executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Execute o servidor:
   ```bash
   npm run dev
   ```

## 🔧 Tecnologias

- Node.js
- Express
- JWT para autenticação
- bcryptjs para hash de senhas
- express-validator para validação
- helmet para segurança
- cors para CORS
- morgan para logs

## 🔧 Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Perfil do usuário (autenticado)

### Usuários
- `GET /api/users` - Listar usuários (autenticado)

## 🔧 Deploy

Veja as opções de hospedagem gratuita no final do README.
