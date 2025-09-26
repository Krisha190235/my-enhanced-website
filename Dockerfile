FROM node:20.11.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npx vite build

FROM node:20.11.0-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]