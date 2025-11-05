# Exemplos de Requisições - API de Autenticação

## 1. Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

**Resposta esperada:** Status 201 (Created)

---

## 2. Fazer login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "uuid-aqui",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

## 3. Acessar perfil (rota protegida)

**Importante:** Substitua `SEU_TOKEN_AQUI` pelo token recebido no login

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "user_id": "uuid-aqui",
    "email": "john@example.com"
  }
}
```

---

## 4. Deletar usuário (requer senha de administrador)

**Importante:** 
- Substitua `SEU_TOKEN_AQUI` pelo token recebido no login
- Substitua `SUA_SENHA_ADMIN` pela senha configurada em `ADMIN_DELETE_PASSWORD` no arquivo `.env`

```bash
curl -X DELETE http://localhost:3000/users/delete \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "x-admin-password: SUA_SENHA_ADMIN"
```

**Resposta esperada:** Status 204 (No Content)

---

## Testando erros comuns

### Login com credenciais inválidas

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "senhaErrada"
  }'
```

**Resposta esperada:** Status 401
```json
{
  "message": "Invalid credentials"
}
```

### Acessar rota protegida sem token

```bash
curl -X GET http://localhost:3000/users/profile
```

**Resposta esperada:** Status 401
```json
{
  "message": "Token not provided"
}
```

### Acessar rota protegida com token inválido

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer token_invalido"
```

**Resposta esperada:** Status 401
```json
{
  "message": "Invalid token"
}
```

---

## Usando no PowerShell (Windows)

### Registrar usuário
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"johndoe","email":"john@example.com","password":"senha123","password_confirmation":"senha123"}'
```

### Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/users/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"john@example.com","password":"senha123"}'

$token = $response.token
Write-Host "Token: $token"
```

### Acessar perfil
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/profile" `
  -Method GET `
  -Headers @{ "Authorization" = "Bearer $token" }
```

### Deletar usuário
```powershell
# Defina a senha de administrador
$adminPassword = "sua-senha-admin-aqui"

Invoke-RestMethod -Uri "http://localhost:3000/users/delete" `
  -Method DELETE `
  -Headers @{ 
    "Authorization" = "Bearer $token"
    "x-admin-password" = $adminPassword
  }
```
