# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies without running lifecycle scripts (to avoid running build before sources are copied)
RUN npm ci --ignore-scripts

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Start the web server
CMD ["npm", "run", "start:web"] 