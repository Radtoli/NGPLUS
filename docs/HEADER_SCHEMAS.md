# Header Schemas com TypeBox e Swagger

## 📋 Visão Geral

Implementação de validação de headers usando Sinclair TypeBox para validação automática pelo Fastify e documentação no Swagger.

## 🎯 Headers Implementados

### Authorization Header (`authHeaderSchema`)

Schema para validação do token JWT de autenticação.

**Localização:** `src/modules/users/infra/http/schemas/headers/authHeaderSchema.ts`

**Estrutura:**
```typescript
{
  authorization: string // Formato: "Bearer <token>"
}
```

**Validação:**
- ✅ Campo obrigatório
- ✅ Deve começar com "Bearer "
- ✅ Pattern regex: `^Bearer .+$`
- ✅ Exemplo no Swagger incluído

## 🔧 Como Usar

### Em uma Rota Protegida

```typescript
import { AuthHeaderType, authHeaderSchema } from "../schemas/headers/authHeaderSchema";
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";

app.get<{ Headers: AuthHeaderType }>("/protected-route", {
  preHandler: authenticateJWT,
  schema: {
    tags: ["Users"],
    summary: "Rota protegida",
    headers: authHeaderSchema,  // 👈 Adiciona validação e documentação
    response: {
      200: responseSchema,
      401: unauthorizedResponseSchema
    },
    security: [{ bearerAuth: [] }]  // 👈 Adiciona cadeado no Swagger
  }
}, handler)
```

### Acessando Headers Validados

Depois da validação do TypeBox, os headers estão disponíveis:

```typescript
async function handler(request: FastifyRequest<{ Headers: AuthHeaderType }>, reply: FastifyReply) {
  // Headers já validados pelo Fastify
  const authHeader = request.headers.authorization;
  
  // Middleware authenticateJWT adiciona:
  const { user_id, email } = request.user!;
}
```

## 📊 Swagger UI

### Visualização no Swagger

Quando você acessa `/docs`, as rotas com header schema aparecem com:

1. **Campo Authorization** na seção de parâmetros
2. **Cadeado** 🔒 indicando rota protegida
3. **Botão "Authorize"** no topo para configurar o token globalmente
4. **Exemplo de formato** do header
5. **Descrição** do que é esperado

### Configurando Token no Swagger

1. Acesse `/docs`
2. Clique no botão **"Authorize"** no topo
3. Digite: `Bearer seu_token_aqui`
4. Clique em **"Authorize"**
5. Agora todas as requisições usarão esse header automaticamente

## 🎨 Schemas de Resposta Implementados

### Schemas de Sucesso

- **`loginResponseSchema`** - Resposta de login com token e dados do usuário
- **`profileResponseSchema`** - Resposta de perfil do usuário

### Schemas de Erro

Todos localizados em `src/shared/infra/http/schemas/errorSchemas.ts`:

- **`unauthorizedResponseSchema`** (401) - Token inválido ou não fornecido
- **`badRequestResponseSchema`** (400) - Dados inválidos
- **`conflictResponseSchema`** (409) - Conflito (ex: email já existe)
- **`notFoundResponseSchema`** (404) - Recurso não encontrado
- **`internalServerErrorResponseSchema`** (500) - Erro do servidor

## 📝 Exemplo Completo de Rota

```typescript
app.get<{ Headers: AuthHeaderType }>("/users/profile", {
  preHandler: authenticateJWT,
  schema: {
    tags: ["Users"],
    summary: "Get authenticated user profile",
    description: "Returns the profile of the authenticated user",
    headers: authHeaderSchema,
    response: {
      200: profileResponseSchema,
      401: unauthorizedResponseSchema,
      500: internalServerErrorResponseSchema
    },
    security: [{ bearerAuth: [] }]
  }
}, async (request, reply) => {
  const { user_id, email } = request.user!;
  
  reply.status(200).send({
    message: "Profile retrieved successfully",
    user: { user_id, email }
  });
})
```

## 🔍 Validação Automática

O Fastify valida automaticamente os headers usando o TypeBox schema:

### ✅ Header Válido
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ Headers Inválidos

**Sem o prefixo "Bearer":**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
❌ Fastify retorna erro de validação

**Header ausente:**
```
(sem Authorization header)
```
❌ Fastify retorna erro de validação

**Formato errado:**
```
Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
❌ Fastify retorna erro de validação

## 🆕 Criando Novos Header Schemas

### Template

```typescript
import { Static, Type } from "@sinclair/typebox";

export const meuHeaderSchema = Type.Object({
  'x-custom-header': Type.String({
    description: 'Descrição do header',
    pattern: '^regex-pattern$',  // opcional
    examples: ['exemplo1', 'exemplo2']
  })
});

export type MeuHeaderType = Static<typeof meuHeaderSchema>;
```

### Uso

```typescript
app.get<{ Headers: MeuHeaderType }>("/rota", {
  schema: {
    headers: meuHeaderSchema,
    // ...
  }
}, handler)
```

## 🎯 Benefícios

1. **Validação Automática** - Fastify valida antes de chegar no handler
2. **Type Safety** - TypeScript sabe exatamente o tipo dos headers
3. **Documentação Automática** - Swagger mostra os headers necessários
4. **Experiência do Desenvolvedor** - Swagger UI permite testar facilmente
5. **Segurança** - Padrões validados previnem erros
6. **Manutenibilidade** - Schemas centralizados e reutilizáveis

## 🔗 Arquivos Relacionados

```
src/
  modules/
    users/
      infra/
        http/
          schemas/
            headers/
              authHeaderSchema.ts          # ⭐ Header de autenticação
            responses/
              profileResponseSchema.ts     # Schema de resposta do perfil
              loginResponseSchema.ts       # Schema de resposta do login
  shared/
    infra/
      http/
        schemas/
          errorSchemas.ts                  # ⭐ Schemas de erro reutilizáveis
        middlewares/
          authenticateJWT.ts               # Middleware de validação JWT
        app.ts                             # ⭐ Configuração do Swagger
```

## 🚀 Testando

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3333/docs`
3. Teste a rota `/users/login` para obter um token
4. Clique em "Authorize" e cole o token
5. Teste a rota `/users/profile` protegida

A interface do Swagger mostrará todos os headers, validações e exemplos automaticamente! 🎉
