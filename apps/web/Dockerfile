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

# Copy all necessary files for build

COPY . .

# Generate Prisma client

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

# Copy build artifacts from builder

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src  # ensures seed/sync scripts are available

# Install only production dependencies

RUN npm ci --omit=dev

EXPOSE 3000

# =========================

# 4️⃣ Container startup

# =========================

# Run migrations, seed superadmin, sync permissions, then start Next.js

CMD npx prisma migrate deploy && 
node --loader ts-node/esm src/app/lib/seeds/assign-superAdmin.ts && 
node --loader ts-node/esm src/app/lib/sync-permissions.ts && 
npm start
