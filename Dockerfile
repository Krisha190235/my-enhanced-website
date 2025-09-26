# --- build stage (Vite) ---
FROM node:20.11.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npx vite build

# --- runtime: Node + serve ---
FROM node:20.11.0-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist

EXPOSE 3000
# Busybox wget is available in Alpine; this keeps Jenkins health/smoke checks happy
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]