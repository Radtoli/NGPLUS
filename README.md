# NGPlusTest

Backend project with Node.js, TypeScript, Fastify, and TypeORM.

## 🚀 Technologies

- Node.js 20.x
- TypeScript
- Fastify
- TypeORM
- PostgreSQL
- Docker & Docker Compose
- Swagger/OpenAPI
- JWT Authentication
- Zod & TypeBox (validation)

## 📁 Project Structure

```
src/
├── modules/          # Application modules (features)
│   ├── users/        # User management & authentication
│   ├── media/        # Media content management
│   └── rating/       # Rating system
├── shared/           # Shared resources
│   ├── errors/       # Custom error classes
│   ├── infra/        # Infrastructure layer
│   │   ├── http/     # HTTP routes & middlewares
│   │   ├── databases/# Database configuration & migrations
│   │   └── containers/# Dependency injection
│   └── utils/        # Utility functions
└── server.ts        # Server entry point
```

## 🐳 Running with Docker (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd NGPlusTest
```

2. **Create `.env` file**
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ngplustest

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Admin
ADMIN_DELETE_PASSWORD=your-admin-password
```

3. **Build and start the containers**
```bash
docker-compose up --build
```

The application will:
- ✅ Install dependencies
- ✅ Build the TypeScript code
- ✅ Run database migrations automatically
- ✅ Start the server on port 3333

4. **Access the application**
- API: http://localhost:3333
- Swagger Documentation: http://localhost:3333/docs
- PostgreSQL: localhost:5432

### Docker Commands

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild after code changes
docker-compose up --build

# Access app container shell
docker-compose exec app sh

# Access PostgreSQL container
docker-compose exec postgres psql -U postgres -d ngplustest
```

## 💻 Running Locally

### Prerequisites

**Important:** This project requires **Node.js v20.x**

Check your Node.js version:
```bash
node --version
# Should output: v20.x.x
```

If you don't have Node.js 20.x, install it:
- **Using nvm (recommended):**
  ```bash
  nvm install 20
  nvm use 20
  ```
- **Direct download:** https://nodejs.org/

### Additional Requirements
- PostgreSQL 15+ installed and running
- npm or yarn package manager

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```bash
cp .env.example .env
```

Update with your local PostgreSQL configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=ngplustest

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d

ADMIN_DELETE_PASSWORD=your-admin-password
```

3. **Create the database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ngplustest;

# Exit
\q
```

4. **Run database migrations**
```bash
npm run typeorm migration:run
```

5. **Start development server**
```bash
npm run dev
```

The server will start on http://localhost:3333

## 📚 Documentation

After starting the server, access the Swagger documentation at:
```
http://localhost:3333/docs
```

The documentation includes:
- All API endpoints
- Request/Response schemas
- Authentication requirements
- Interactive testing interface

For more detailed documentation, see the `docs/` folder:
- [API Examples](docs/API_EXAMPLES.md) - Request examples with curl and PowerShell
- [JWT Authentication](docs/JWT_AUTH.md) - Authentication flow and usage
- [Header Schemas](docs/HEADER_SCHEMAS.md) - Header validation and Swagger integration

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server (requires build first)

# Testing
npm test                 # Run all unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Database
npm run typeorm migration:run     # Run pending migrations
npm run typeorm migration:revert  # Revert last migration
npm run typeorm migration:create  # Create new migration

# Code Quality
npm run lint             # Run ESLint
```

## 🏗️ Architecture

This project follows a **Clean Architecture** pattern with:

- **Modules**: Business logic separated by domain (users, media, rating)
- **DTOs**: Data Transfer Objects for request/response
- **Services**: Business logic implementation
- **Repositories**: Data access layer with interfaces
- **Infrastructure**: HTTP layer, database, dependency injection
- **Shared**: Reusable code across modules

### Key Patterns
- Dependency Injection (using Awilix)
- Repository Pattern
- Service Layer
- Error Handling with custom AppError class

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register a new user: `POST /users/register`
2. Login to get token: `POST /users/login`
3. Use token in header: `Authorization: Bearer <token>`
4. Access protected routes

See [JWT_AUTH.md](docs/JWT_AUTH.md) for detailed information.

## 🗃️ Database Migrations

Migrations are automatically run when using Docker. For local development:

```bash
# Run all pending migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert

# Create a new migration
npm run typeorm migration:create src/shared/infra/databases/migrations/MigrationName
```

## 📝 Adding New Modules

Create a new folder in `src/modules/` with the following structure:

```
src/modules/your-module/
├── Dtos/                    # Data Transfer Objects
├── enums/                   # Enumerations
├── infra/
│   ├── Http/
│   │   ├── Handlers/       # Route handlers
│   │   ├── routes/         # Route definitions
│   │   └── schemas/        # Validation schemas
│   └── typeorm/            # TypeORM entities
├── Repositories/
│   ├── implementation/     # Repository implementations
│   └── model/             # Repository interfaces
└── Services/              # Business logic services
```

## 🧪 Testing

This project includes comprehensive unit tests for all services using Jest and ts-jest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized by module and service, following the same structure as the source code:

```
src/modules/
├── users/
│   └── services/
│       └── __tests__/
│           ├── RegisterUserService.test.ts
│           ├── LoginUserService.test.ts
│           ├── UpdateUserService.test.ts
│           └── DeleteUserService.test.ts
├── media/
│   └── Services/
│       └── __tests__/
│           ├── CreateMediaService.test.ts
│           ├── GetMediaService.test.ts
│           ├── ListMediaService.test.ts
│           ├── UpdateMediaService.test.ts
│           └── DeleteMediaService.test.ts
└── rating/
    └── Services/
        └── __tests__/
            ├── CreateRatingService.test.ts
            ├── GetRatingService.test.ts
            ├── ListRatingService.test.ts
            ├── UpdateRatingService.test.ts
            └── DeleteRatingService.test.ts
```

### Test Coverage

The tests cover:

- ✅ **Users Module**
  - User registration with validation
  - User login and JWT token generation
  - User profile updates
  - User deletion with admin password
  
- ✅ **Media Module**
  - Media content creation
  - Media retrieval (single and list)
  - Media updates
  - Media deletion
  
- ✅ **Rating Module**
  - Rating creation with validations
  - Rating retrieval (single and list)
  - Rating updates (owner validation)
  - Rating deletion (owner validation)

### Test Features

- **Mocked Dependencies**: All repository dependencies are mocked using Jest
- **Error Scenarios**: Each service tests both success and error cases
- **Validation Testing**: Tests verify input validation (e.g., password confirmation, star ratings)
- **Authorization Testing**: Tests verify user permissions (e.g., only owners can update/delete)
- **Environment Variables**: Tests handle environment configuration (e.g., JWT_SECRET, ADMIN_PASSWORD)

### Coverage Report

After running `npm run test:coverage`, you can find the detailed coverage report in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view the interactive coverage report.

The coverage configuration excludes:
- Infrastructure code (database, HTTP, containers)
- DTOs and enums
- Main server entry point
- Type definitions

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3333 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | ngplustest |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | Token expiration | 1d |
| `ADMIN_DELETE_PASSWORD` | Admin password for user deletion | - |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
