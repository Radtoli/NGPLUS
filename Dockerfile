# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install tsconfig-paths for runtime path resolution
RUN npm install tsconfig-paths

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy source files needed for TypeORM CLI (migrations, entities)
COPY --from=builder /app/src ./src

# Copy tsconfig if needed for TypeORM
COPY --from=builder /app/tsconfig.json ./

# Install ts-node-dev for running TypeORM migrations
RUN npm install --save-dev ts-node-dev

# Expose the application port (adjust if needed)
EXPOSE 3333

# Create entrypoint script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "Running TypeORM migrations..."' >> /app/entrypoint.sh && \
    echo 'npm run typeorm migration:run' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "Starting application..."' >> /app/entrypoint.sh && \
    echo 'exec npm start' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Use the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
