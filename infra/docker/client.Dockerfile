FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY client/package*.json ./
RUN npm ci || npm install

FROM base AS build
COPY client/package*.json ./
RUN npm ci || npm install
COPY client ./
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
