# JWT Authentication - Login Route

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
```

**Important:** Change `JWT_SECRET` to a secure value in production!

## Endpoints

### POST /users/login

Authenticates a user and returns a JWT token.

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

## Using the JWT Token

To access protected routes, include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example in Protected Routes

```typescript
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";

app.get("/protected-route", {
  preHandler: authenticateJWT
}, async (request, reply) => {
  // request.user contains the authenticated user data
  const { user_id, email } = request.user!;
  
  reply.send({ message: "You are authenticated!", user_id, email });
});
```

## File Structure

```
src/
  modules/
    users/
      Dtos/
        loginUserDTO.ts                    # Login DTO interface
      services/
        LoginUserService.ts                # Login service with JWT
      infra/
        http/
          Handlers/
            loginUserHandler.ts            # Login route handler
          routes/
            users.routes.ts                # Updated routes (register + login)
          schemas/
            bodies/
              loginUsersBodySchema.ts      # Body validation schema
            responses/
              loginResponseSchema.ts       # Response schema
  shared/
    infra/
      http/
        middlewares/
          authenticateJWT.ts               # JWT authentication middleware
      containers/
        registerServices.ts                # LoginUserService registration
```

## Authentication Flow

1. **Login**: User sends email and password
2. **Validation**: System verifies credentials in the database
3. **Token Generation**: JWT is generated with user information
4. **Return**: Token and user data are returned
5. **Usage**: Client includes the token in subsequent requests
6. **Validation**: `authenticateJWT` middleware validates the token on protected routes

## Security

- Passwords are verified using PBKDF2 with salt and pepper
- JWT tokens have configurable expiration time
- Tokens include `user_id` and `email` in the payload
- Middleware validates token and adds user data to `request.user`

## Token Payload

The JWT token contains the following payload:

```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

- **user_id**: Unique identifier of the user
- **email**: User's email address
- **iat** (Issued At): Timestamp when the token was created
- **exp** (Expiration): Timestamp when the token expires

## Best Practices

1. **Always use HTTPS** in production to prevent token interception
2. **Use strong JWT_SECRET** - Generate a random string with at least 32 characters
3. **Set appropriate expiration time** - Balance between security and user experience
4. **Store tokens securely** on the client side (avoid localStorage for sensitive apps)
5. **Implement token refresh** mechanism for better UX
6. **Validate tokens on every protected route** using the middleware
7. **Never expose JWT_SECRET** in client-side code or version control

## Troubleshooting

### "Token not provided"
- Ensure you're including the Authorization header
- Check the header format: `Authorization: Bearer <token>`

### "Invalid token"
- Token may be expired - login again to get a new one
- Token may be malformed - ensure you're copying the complete token
- JWT_SECRET may have changed - old tokens won't work

### "Invalid credentials"
- Check email and password are correct
- Ensure the user exists in the database
- Verify password is being sent in the request body
