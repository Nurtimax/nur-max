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

# State file (.data/state.json) lives here — mount a volume to persist it
VOLUME ["/app/.data"]

# Token is provided at runtime: --env-file .env or -e TELEGRAM_BOT_TOKEN=...
CMD ["node", "dist/main.js"]
