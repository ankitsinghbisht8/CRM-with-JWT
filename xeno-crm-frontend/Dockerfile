# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set build time environment variables with ARG
ARG REACT_APP_API_URL
ARG PORT

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV PORT=$PORT

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 3001

# Start the application using serve
CMD ["serve", "-s", "build", "-l", "3001"] 