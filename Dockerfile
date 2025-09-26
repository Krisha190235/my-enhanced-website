FROM node:20.11.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build production-ready assets
RUN npm run build

# Serve with Vite's built-in preview server
EXPOSE 4173
CMD ["npm", "run", "preview"]