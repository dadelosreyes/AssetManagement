FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Serve with node static server (serve)
FROM node:20-alpine
WORKDIR /app

# Install the serve package globally
RUN npm install -g serve

# Copy the built assets from the previous stage
COPY --from=build /app/dist .

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 8080 (which docker-compose maps to 8080)
EXPOSE 8080

# Use entrypoint script to generate runtime env config and start serve
ENTRYPOINT ["/docker-entrypoint.sh"]
