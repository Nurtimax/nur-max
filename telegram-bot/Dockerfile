# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-alpine
WORKDIR /app

ENV TZ=Asia/Bishkek
RUN apk add --no-cache tzdata

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# State lives in PostgreSQL (see docker-compose.yml) — no local volumes needed.
# Token/db creds are provided at runtime: --env-file .env
CMD ["node", "dist/main.js"]
