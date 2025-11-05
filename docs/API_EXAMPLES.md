# API Request Examples - Authentication API# Exemplos de Requisições - API de Autenticação



## 1. Register a New User## 1. Registrar um novo usuário



```bash```bash

curl -X POST http://localhost:3333/users/register \curl -X POST http://localhost:3000/users/register \

  -H "Content-Type: application/json" \  -H "Content-Type: application/json" \

  -d '{  -d '{

    "username": "johndoe",    "username": "johndoe",

    "email": "john@example.com",    "email": "john@example.com",

    "password": "password123",    "password": "senha123",

    "password_confirmation": "password123"    "password_confirmation": "senha123"

  }'  }'

``````



**Expected Response:** Status 201 (Created)**Resposta esperada:** Status 201 (Created)



------



## 2. Login## 2. Fazer login



```bash```bash

curl -X POST http://localhost:3333/users/login \curl -X POST http://localhost:3000/users/login \

  -H "Content-Type: application/json" \  -H "Content-Type: application/json" \

  -d '{  -d '{

    "email": "john@example.com",    "email": "john@example.com",

    "password": "password123"    "password": "senha123"

  }'  }'

``````



**Expected Response:****Resposta esperada:**

```json```json

{{

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "user": {  "user": {

    "user_id": "uuid-here",    "user_id": "uuid-aqui",

    "username": "johndoe",    "username": "johndoe",

    "email": "john@example.com"    "email": "john@example.com"

  }  }

}}

``````



------



## 3. Access Profile (Protected Route)## 3. Acessar perfil (rota protegida)



**Important:** Replace `YOUR_TOKEN_HERE` with the token received from login**Importante:** Substitua `SEU_TOKEN_AQUI` pelo token recebido no login



```bash```bash

curl -X GET http://localhost:3333/users/profile \curl -X GET http://localhost:3000/users/profile \

  -H "Authorization: Bearer YOUR_TOKEN_HERE"  -H "Authorization: Bearer SEU_TOKEN_AQUI"

``````



**Expected Response:****Resposta esperada:**

```json```json

{{

  "message": "Profile retrieved successfully",  "message": "Profile retrieved successfully",

  "user": {  "user": {

    "user_id": "uuid-here",    "user_id": "uuid-aqui",

    "email": "john@example.com"    "email": "john@example.com"

  }  }

}}

``````



------



## 4. Delete User (Requires Admin Password)## 4. Deletar usuário (requer senha de administrador)



**Important:** **Importante:** 

- Replace `YOUR_TOKEN_HERE` with the token received from login- Substitua `SEU_TOKEN_AQUI` pelo token recebido no login

- Replace `YOUR_ADMIN_PASSWORD` with the password configured in `ADMIN_DELETE_PASSWORD` in the `.env` file- Substitua `SUA_SENHA_ADMIN` pela senha configurada em `ADMIN_DELETE_PASSWORD` no arquivo `.env`



```bash```bash

curl -X DELETE http://localhost:3333/users/delete \curl -X DELETE http://localhost:3000/users/delete \

  -H "Authorization: Bearer YOUR_TOKEN_HERE" \  -H "Authorization: Bearer SEU_TOKEN_AQUI" \

  -H "x-admin-password: YOUR_ADMIN_PASSWORD"  -H "x-admin-password: SUA_SENHA_ADMIN"

``````



**Expected Response:** Status 204 (No Content)**Resposta esperada:** Status 204 (No Content)



------



## Testing Common Errors## Testando erros comuns



### Login with Invalid Credentials### Login com credenciais inválidas



```bash```bash

curl -X POST http://localhost:3333/users/login \curl -X POST http://localhost:3000/users/login \

  -H "Content-Type: application/json" \  -H "Content-Type: application/json" \

  -d '{  -d '{

    "email": "john@example.com",    "email": "john@example.com",

    "password": "wrongPassword"    "password": "senhaErrada"

  }'  }'

``````



**Expected Response:** Status 401**Resposta esperada:** Status 401

```json```json

{{

  "message": "Invalid credentials"  "message": "Invalid credentials"

}}

``````



### Access Protected Route Without Token### Acessar rota protegida sem token



```bash```bash

curl -X GET http://localhost:3333/users/profilecurl -X GET http://localhost:3000/users/profile

``````



**Expected Response:** Status 401**Resposta esperada:** Status 401

```json```json

{{

  "message": "Token not provided"  "message": "Token not provided"

}}

``````



### Access Protected Route with Invalid Token### Acessar rota protegida com token inválido



```bash```bash

curl -X GET http://localhost:3333/users/profile \curl -X GET http://localhost:3000/users/profile \

  -H "Authorization: Bearer invalid_token"  -H "Authorization: Bearer token_invalido"

``````



**Expected Response:** Status 401**Resposta esperada:** Status 401

```json```json

{{

  "message": "Invalid token"  "message": "Invalid token"

}}

``````



------



## Using PowerShell (Windows)## Usando no PowerShell (Windows)



### Register User### Registrar usuário

```powershell```powershell

Invoke-RestMethod -Uri "http://localhost:3333/users/register" `Invoke-RestMethod -Uri "http://localhost:3000/users/register" `

  -Method POST `  -Method POST `

  -ContentType "application/json" `  -ContentType "application/json" `

  -Body '{"username":"johndoe","email":"john@example.com","password":"password123","password_confirmation":"password123"}'  -Body '{"username":"johndoe","email":"john@example.com","password":"senha123","password_confirmation":"senha123"}'

``````



### Login### Login

```powershell```powershell

$response = Invoke-RestMethod -Uri "http://localhost:3333/users/login" `$response = Invoke-RestMethod -Uri "http://localhost:3000/users/login" `

  -Method POST `  -Method POST `

  -ContentType "application/json" `  -ContentType "application/json" `

  -Body '{"email":"john@example.com","password":"password123"}'  -Body '{"email":"john@example.com","password":"senha123"}'



$token = $response.token$token = $response.token

Write-Host "Token: $token"Write-Host "Token: $token"

``````



### Access Profile### Acessar perfil

```powershell```powershell

Invoke-RestMethod -Uri "http://localhost:3333/users/profile" `Invoke-RestMethod -Uri "http://localhost:3000/users/profile" `

  -Method GET `  -Method GET `

  -Headers @{ "Authorization" = "Bearer $token" }  -Headers @{ "Authorization" = "Bearer $token" }

``````



### Delete User### Deletar usuário

```powershell```powershell

# Set the admin password# Defina a senha de administrador

$adminPassword = "your-admin-password-here"$adminPassword = "sua-senha-admin-aqui"



Invoke-RestMethod -Uri "http://localhost:3333/users/delete" `Invoke-RestMethod -Uri "http://localhost:3000/users/delete" `

  -Method DELETE `  -Method DELETE `

  -Headers @{   -Headers @{ 

    "Authorization" = "Bearer $token"    "Authorization" = "Bearer $token"

    "x-admin-password" = $adminPassword    "x-admin-password" = $adminPassword

  }  }

``````


---

## Media Endpoints

### Create Media Content

```bash
curl -X POST http://localhost:3333/media \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Movie",
    "description": "An amazing movie",
    "category": "movie",
    "release_year": 2024
  }'
```

### List Media

```bash
curl -X GET "http://localhost:3333/media?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Media by ID

```bash
curl -X GET http://localhost:3333/media/{media_id} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Media

```bash
curl -X PUT http://localhost:3333/media/{media_id} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### Delete Media

```bash
curl -X DELETE http://localhost:3333/media/{media_id} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rating Endpoints

### Create Rating

```bash
curl -X POST http://localhost:3333/ratings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "media_id": "uuid-here",
    "rating": 5,
    "comment": "Great movie!"
  }'
```

### List Ratings

```bash
curl -X GET "http://localhost:3333/ratings?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Rating

```bash
curl -X PUT http://localhost:3333/ratings/{rating_id} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Actually, pretty good"
  }'
```

### Delete Rating

```bash
curl -X DELETE http://localhost:3333/ratings/{rating_id} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Using the Swagger UI

For a more interactive experience, visit the Swagger documentation at `http://localhost:3333/docs`:

1. Click the **"Authorize"** button at the top
2. Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"** to save
4. Now you can test all endpoints directly from the browser!

All protected routes will automatically include the authorization header.
