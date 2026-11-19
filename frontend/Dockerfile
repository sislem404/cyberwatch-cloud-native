# Compilation de React
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serveur Nginx sans privilèges root
FROM nginx/nginx-unprivileged:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080