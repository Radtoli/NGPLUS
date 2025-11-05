# NGPlusTest

Backend project with Node.js, TypeScript and Fastify.

## 🚀 Technologies

- Node.js
- TypeScript
- Fastify
- Swagger/OpenAPI
- Zod (validation)

## 📁 Project Structure

```
src/
├── modules/          # Application modules (features)
├── shared/           # Shared resources
│   ├── errors/       # Custom error classes
│   ├── infra/        # Infrastructure layer
│   │   └── http/     # HTTP routes
│   └── utils/        # Utility functions
├── app.ts           # Fastify app configuration
└── server.ts        # Server entry point
```

## 🔧 Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## 📚 Documentation

After starting the server, access the Swagger documentation at:
```
http://localhost:3333/docs
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

This project follows a modular architecture with:

- **Modules**: Contains business logic separated by domain
- **Shared**: Contains reusable code across modules
- **Infrastructure**: HTTP layer, routes, and external services integration

## 📝 Adding New Modules

Create a new folder in `src/modules/` with the following structure:

```
src/modules/your-module/
├── dtos/
├── infra/
│   └── http/
│       ├── controllers/
│       └── routes/
├── repositories/
├── services/
└── useCases/
```
