FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Pass backend API URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app
RUN npm run build

# Serve with node static server (serve)
FROM node:20-alpine
WORKDIR /app

# Install the serve package globally
RUN npm install -g serve

# Copy the built assets from the previous stage
COPY --from=build /app/dist .

# Expose port 8080 (which docker-compose maps to 8080)
EXPOSE 8080

# Run the static server (single page application mode)
CMD ["serve", "-s", ".", "-l", "8080"]
