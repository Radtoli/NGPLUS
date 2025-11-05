# Autenticação JWT - Rota de Login

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
```

**Importante:** Altere o `JWT_SECRET` para um valor seguro em produção!

## Endpoints

### POST /users/login

Autentica um usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "uuid-here",
    "username": "username",
    "email": "user@example.com"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

## Usando o Token JWT

Para acessar rotas protegidas, inclua o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo de uso em rotas protegidas

```typescript
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";

app.get("/protected-route", {
  preHandler: authenticateJWT
}, async (request, reply) => {
  // request.user contém os dados do usuário autenticado
  const { user_id, email } = request.user!;
  
  reply.send({ message: "Você está autenticado!", user_id, email });
});
```

## Estrutura de Arquivos Criados

```
src/
  modules/
    users/
      Dtos/
        loginUserDTO.ts                    # Interface do DTO de login
      services/
        LoginUserService.ts                # Serviço de login com JWT
      infra/
        http/
          Handlers/
            loginUserHandler.ts            # Handler da rota de login
          routes/
            users.routes.ts                # Rotas atualizadas (register + login)
          schemas/
            bodies/
              loginUsersBodySchema.ts      # Schema de validação do body
            responses/
              loginResponseSchema.ts       # Schema de resposta
  shared/
    infra/
      http/
        middlewares/
          authenticateJWT.ts               # Middleware de autenticação JWT
      containers/
        registerServices.ts                # Registro do LoginUserService
```

## Fluxo de Autenticação

1. **Login**: Usuário envia email e senha
2. **Validação**: Sistema verifica credenciais no banco de dados
3. **Geração do Token**: JWT é gerado com informações do usuário
4. **Retorno**: Token e dados do usuário são retornados
5. **Uso**: Cliente inclui o token nas próximas requisições
6. **Validação**: Middleware `authenticateJWT` valida o token nas rotas protegidas

## Segurança

- Senhas são verificadas usando PBKDF2 com salt e pepper
- Tokens JWT têm tempo de expiração configurável
- Tokens incluem `user_id` e `email` no payload
- Middleware valida token e adiciona dados do usuário no `request.user`
