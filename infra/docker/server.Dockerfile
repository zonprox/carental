FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY server/package*.json ./
RUN npm ci --only=production || npm install --only=production

FROM base AS build
COPY server/package*.json ./
RUN npm ci || npm install
COPY shared ../shared
WORKDIR /shared
COPY shared/package*.json ./
RUN npm install
WORKDIR /app
COPY server ./
RUN npm run prisma:generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts
COPY shared ../shared
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node dist/server/src/index.js"]
