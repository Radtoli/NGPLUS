# Header Schemas with TypeBox and Swagger# Header Schemas com TypeBox e Swagger



## 📋 Overview## 📋 Visão Geral



Implementation of header validation using Sinclair TypeBox for automatic validation by Fastify and Swagger documentation.Implementação de validação de headers usando Sinclair TypeBox para validação automática pelo Fastify e documentação no Swagger.



## 🎯 Implemented Headers## 🎯 Headers Implementados



### Authorization Header (`authHeaderSchema`)### Authorization Header (`authHeaderSchema`)



Schema for JWT authentication token validation.Schema para validação do token JWT de autenticação.



**Location:** `src/modules/users/infra/http/schemas/headers/authHeaderSchema.ts`**Localização:** `src/modules/users/infra/http/schemas/headers/authHeaderSchema.ts`



**Structure:****Estrutura:**

```typescript```typescript

{{

  authorization: string // Format: "Bearer <token>"  authorization: string // Formato: "Bearer <token>"

}}

``````



**Validation:****Validação:**

- ✅ Required field- ✅ Campo obrigatório

- ✅ Must start with "Bearer "- ✅ Deve começar com "Bearer "

- ✅ Regex pattern: `^Bearer .+$`- ✅ Pattern regex: `^Bearer .+$`

- ✅ Swagger example included- ✅ Exemplo no Swagger incluído



## 🔧 How to Use## 🔧 Como Usar



### In a Protected Route### Em uma Rota Protegida



```typescript```typescript

import { AuthHeaderType, authHeaderSchema } from "../schemas/headers/authHeaderSchema";import { AuthHeaderType, authHeaderSchema } from "../schemas/headers/authHeaderSchema";

import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";



app.get<{ Headers: AuthHeaderType }>("/protected-route", {app.get<{ Headers: AuthHeaderType }>("/protected-route", {

  preHandler: authenticateJWT,  preHandler: authenticateJWT,

  schema: {  schema: {

    tags: ["Users"],    tags: ["Users"],

    summary: "Protected route",    summary: "Rota protegida",

    headers: authHeaderSchema,  // 👈 Adds validation and documentation    headers: authHeaderSchema,  // 👈 Adiciona validação e documentação

    response: {    response: {

      200: responseSchema,      200: responseSchema,

      401: unauthorizedResponseSchema      401: unauthorizedResponseSchema

    },    },

    security: [{ bearerAuth: [] }]  // 👈 Adds lock icon in Swagger    security: [{ bearerAuth: [] }]  // 👈 Adiciona cadeado no Swagger

  }  }

}, handler)}, handler)

``````



### Accessing Validated Headers### Acessando Headers Validados



After TypeBox validation, headers are available:Depois da validação do TypeBox, os headers estão disponíveis:



```typescript```typescript

async function handler(request: FastifyRequest<{ Headers: AuthHeaderType }>, reply: FastifyReply) {async function handler(request: FastifyRequest<{ Headers: AuthHeaderType }>, reply: FastifyReply) {

  // Headers already validated by Fastify  // Headers já validados pelo Fastify

  const authHeader = request.headers.authorization;  const authHeader = request.headers.authorization;

    

  // authenticateJWT middleware adds:  // Middleware authenticateJWT adiciona:

  const { user_id, email } = request.user!;  const { user_id, email } = request.user!;

}}

``````



## 📊 Swagger UI## 📊 Swagger UI



### Visualization in Swagger### Visualização no Swagger



When you access `/docs`, routes with header schema display:Quando você acessa `/docs`, as rotas com header schema aparecem com:



1. **Authorization field** in the parameters section1. **Campo Authorization** na seção de parâmetros

2. **Lock icon** 🔒 indicating protected route2. **Cadeado** 🔒 indicando rota protegida

3. **"Authorize" button** at the top to configure token globally3. **Botão "Authorize"** no topo para configurar o token globalmente

4. **Format example** of the header4. **Exemplo de formato** do header

5. **Description** of what is expected5. **Descrição** do que é esperado



### Configuring Token in Swagger### Configurando Token no Swagger



1. Access `/docs`1. Acesse `/docs`

2. Click the **"Authorize"** button at the top2. Clique no botão **"Authorize"** no topo

3. Enter: `Bearer your_token_here`3. Digite: `Bearer seu_token_aqui`

4. Click **"Authorize"**4. Clique em **"Authorize"**

5. Now all requests will use this header automatically5. Agora todas as requisições usarão esse header automaticamente



## 🎨 Implemented Response Schemas## 🎨 Schemas de Resposta Implementados



### Success Schemas### Schemas de Sucesso



- **`loginResponseSchema`** - Login response with token and user data- **`loginResponseSchema`** - Resposta de login com token e dados do usuário

- **`profileResponseSchema`** - User profile response- **`profileResponseSchema`** - Resposta de perfil do usuário



### Error Schemas### Schemas de Erro



All located in `src/shared/infra/http/schemas/errorSchemas.ts`:Todos localizados em `src/shared/infra/http/schemas/errorSchemas.ts`:



- **`unauthorizedResponseSchema`** (401) - Invalid or missing token- **`unauthorizedResponseSchema`** (401) - Token inválido ou não fornecido

- **`badRequestResponseSchema`** (400) - Invalid data- **`badRequestResponseSchema`** (400) - Dados inválidos

- **`conflictResponseSchema`** (409) - Conflict (e.g., email already exists)- **`conflictResponseSchema`** (409) - Conflito (ex: email já existe)

- **`notFoundResponseSchema`** (404) - Resource not found- **`notFoundResponseSchema`** (404) - Recurso não encontrado

- **`internalServerErrorResponseSchema`** (500) - Server error- **`internalServerErrorResponseSchema`** (500) - Erro do servidor



## 📝 Complete Route Example## 📝 Exemplo Completo de Rota



```typescript```typescript

app.get<{ Headers: AuthHeaderType }>("/users/profile", {app.get<{ Headers: AuthHeaderType }>("/users/profile", {

  preHandler: authenticateJWT,  preHandler: authenticateJWT,

  schema: {  schema: {

    tags: ["Users"],    tags: ["Users"],

    summary: "Get authenticated user profile",    summary: "Get authenticated user profile",

    description: "Returns the profile of the authenticated user",    description: "Returns the profile of the authenticated user",

    headers: authHeaderSchema,    headers: authHeaderSchema,

    response: {    response: {

      200: profileResponseSchema,      200: profileResponseSchema,

      401: unauthorizedResponseSchema,      401: unauthorizedResponseSchema,

      500: internalServerErrorResponseSchema      500: internalServerErrorResponseSchema

    },    },

    security: [{ bearerAuth: [] }]    security: [{ bearerAuth: [] }]

  }  }

}, async (request, reply) => {}, async (request, reply) => {

  const { user_id, email } = request.user!;  const { user_id, email } = request.user!;

    

  reply.status(200).send({  reply.status(200).send({

    message: "Profile retrieved successfully",    message: "Profile retrieved successfully",

    user: { user_id, email }    user: { user_id, email }

  });  });

})})

``````



## 🔍 Automatic Validation## 🔍 Validação Automática



Fastify automatically validates headers using the TypeBox schema:O Fastify valida automaticamente os headers usando o TypeBox schema:



### ✅ Valid Header### ✅ Header Válido

``````

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

``````



### ❌ Invalid Headers### ❌ Headers Inválidos



**Without "Bearer" prefix:****Sem o prefixo "Bearer":**

``````

Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

``````

❌ Fastify returns validation error❌ Fastify retorna erro de validação



**Missing header:****Header ausente:**

``````

(no Authorization header)(sem Authorization header)

``````

❌ Fastify returns validation error❌ Fastify retorna erro de validação



**Wrong format:****Formato errado:**

``````

Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

``````

❌ Fastify returns validation error❌ Fastify retorna erro de validação



## 🆕 Creating New Header Schemas## 🆕 Criando Novos Header Schemas



### Template### Template



```typescript```typescript

import { Static, Type } from "@sinclair/typebox";import { Static, Type } from "@sinclair/typebox";



export const myHeaderSchema = Type.Object({export const meuHeaderSchema = Type.Object({

  'x-custom-header': Type.String({  'x-custom-header': Type.String({

    description: 'Header description',    description: 'Descrição do header',

    pattern: '^regex-pattern$',  // optional    pattern: '^regex-pattern$',  // opcional

    examples: ['example1', 'example2']    examples: ['exemplo1', 'exemplo2']

  })  })

});});



export type MyHeaderType = Static<typeof myHeaderSchema>;export type MeuHeaderType = Static<typeof meuHeaderSchema>;

``````



### Usage### Uso



```typescript```typescript

app.get<{ Headers: MyHeaderType }>("/route", {app.get<{ Headers: MeuHeaderType }>("/rota", {

  schema: {  schema: {

    headers: myHeaderSchema,    headers: meuHeaderSchema,

    // ...    // ...

  }  }

}, handler)}, handler)

``````



## 🎯 Benefits## 🎯 Benefícios



1. **Automatic Validation** - Fastify validates before reaching the handler1. **Validação Automática** - Fastify valida antes de chegar no handler

2. **Type Safety** - TypeScript knows the exact type of headers2. **Type Safety** - TypeScript sabe exatamente o tipo dos headers

3. **Automatic Documentation** - Swagger shows required headers3. **Documentação Automática** - Swagger mostra os headers necessários

4. **Developer Experience** - Swagger UI allows easy testing4. **Experiência do Desenvolvedor** - Swagger UI permite testar facilmente

5. **Security** - Validated patterns prevent errors5. **Segurança** - Padrões validados previnem erros

6. **Maintainability** - Centralized and reusable schemas6. **Manutenibilidade** - Schemas centralizados e reutilizáveis



## 🔗 Related Files## 🔗 Arquivos Relacionados



``````

src/src/

  modules/  modules/

    users/    users/

      infra/      infra/

        http/        http/

          schemas/          schemas/

            headers/            headers/

              authHeaderSchema.ts          # ⭐ Authentication header              authHeaderSchema.ts          # ⭐ Header de autenticação

            responses/            responses/

              profileResponseSchema.ts     # Profile response schema              profileResponseSchema.ts     # Schema de resposta do perfil

              loginResponseSchema.ts       # Login response schema              loginResponseSchema.ts       # Schema de resposta do login

  shared/  shared/

    infra/    infra/

      http/      http/

        schemas/        schemas/

          errorSchemas.ts                  # ⭐ Reusable error schemas          errorSchemas.ts                  # ⭐ Schemas de erro reutilizáveis

        middlewares/        middlewares/

          authenticateJWT.ts               # JWT validation middleware          authenticateJWT.ts               # Middleware de validação JWT

        app.ts                             # ⭐ Swagger configuration        app.ts                             # ⭐ Configuração do Swagger

``````



## 🚀 Testing## 🚀 Testando



1. Start the server: `npm run dev`1. Inicie o servidor: `npm run dev`

2. Access: `http://localhost:3333/docs`2. Acesse: `http://localhost:3333/docs`

3. Test the `/users/login` route to get a token3. Teste a rota `/users/login` para obter um token

4. Click "Authorize" and paste the token4. Clique em "Authorize" e cole o token

5. Test the protected `/users/profile` route5. Teste a rota `/users/profile` protegida



The Swagger interface will automatically show all headers, validations, and examples! 🎉A interface do Swagger mostrará todos os headers, validações e exemplos automaticamente! 🎉

