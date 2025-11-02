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

# Copy everything needed for build (including Prisma schema)
COPY . .

# Generate Prisma client before building Next.js
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build Next.js app
RUN npm run build -- --no-lint

# =========================
# 3️⃣ Production runtime
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 3000

# ✅ Run migrations and seed at container startup
CMD npx prisma migrate deploy && \
    node src/app/lib/seeds/assign-superAdmin.ts && \
    npm start
