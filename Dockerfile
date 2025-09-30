# Multi-stage build for production
FROM node:22.20.0-alpine AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY apps/frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY apps/frontend/ ./

# Build frontend
RUN npm run build

# Backend stage
FROM node:22.20.0-alpine AS backend

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    dumb-init

# Copy backend package files
COPY apps/backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source code
COPY apps/backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S carental -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R carental:nodejs /app
USER carental

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/server.js"]