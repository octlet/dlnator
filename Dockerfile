# Install dependencies and build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache ffmpeg python3 curl ca-certificates \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp

COPY package.json ./
COPY package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]