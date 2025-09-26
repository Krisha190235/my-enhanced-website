# ---- Build stage ----
FROM node:20.11.0-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --include=dev

# Build
COPY . .
RUN npx vite build

# ---- Runtime stage ----
FROM node:20.11.0-alpine
WORKDIR /app

# Install a tiny static file server
RUN npm i -g serve@14 && apk add --no-cache curl

# Copy built assets
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# Healthcheck hits the built index to ensure server is ready
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=12 \
  CMD curl -fsS http://localhost:3000/index.html > /dev/null || exit 1

# IMPORTANT: listen on all interfaces so Docker port mapping works
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]
