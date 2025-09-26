# --- Build stage: produce static assets with Vite ---
FROM node:20.11.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npx vite build

# --- Runtime stage: serve dist with `serve` on port 3000 ---
FROM node:20.11.0-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD wget -qO- http://localhost:3000 || exit 1
CMD ["serve", "-s", "dist", "-l", "3000"]