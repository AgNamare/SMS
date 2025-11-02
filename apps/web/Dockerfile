# =========================
# 1️⃣ Base dependencies
# =========================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# =========================
# 2️⃣ Build stage
# =========================
FROM base AS builder
WORKDIR /app

# Copy everything needed for build (including Prisma schema and TS files)
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compile TypeScript seed to JavaScript
RUN npx tsc src/app/lib/seeds/assign-superAdmin.ts --outDir ./dist/seeds

# Build Next.js app
RUN npm run build -- --no-lint

# =========================
# 3️⃣ Production runtime
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built files and compiled seed
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist/seeds ./dist/seeds

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 3000

# ✅ Run migrations and compiled JS seed at container startup
CMD npx prisma migrate deploy && \
    node dist/seeds/assign-superAdmin.js && \
    npm start
