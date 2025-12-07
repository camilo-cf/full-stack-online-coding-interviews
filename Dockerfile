# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage caching
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install Backend Dependencies
WORKDIR /app/server
RUN npm install

# Install Frontend Dependencies
WORKDIR /app/client
RUN npm install

# Copy source code
WORKDIR /app
COPY . .

# Build Frontend (outputs to client/dist)
WORKDIR /app/client
RUN npm run build

# Stage 2: Create production image
FROM node:20-alpine

WORKDIR /app

# Copy Server directory (with installed modules and source)
COPY --from=build /app/server /app/server

# Copy Built Frontend Assets
COPY --from=build /app/client/dist /app/client/dist

# Security: Run as non-root user
RUN chown -R node:node /app
USER node

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server
WORKDIR /app/server
CMD ["npm", "start"]
