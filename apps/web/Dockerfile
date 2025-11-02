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

# Copy package.json first to allow for dependency installation/cleanup
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src  # ensures seed/sync scripts are available

# NOTE: We skip copying node_modules directly, as npm ci will handle it, leading to a smaller final image.

# Install only production dependencies
# This also removes dev dependencies like 'ts-node'.
RUN npm ci --omit=dev

# FIX for 'exit status 1': The startup commands rely on 'ts-node' (a dev dependency).
# We explicitly re-install the necessary dev dependencies required for the startup scripts
# after the production cleanup, without saving them to package.json.
RUN npm install ts-node typescript --no-save

EXPOSE 3000

# =========================

# 4️⃣ Container startup

# =========================

# Run migrations, seed superadmin, sync permissions, then start Next.js
# FIX for "unknown instruction: node": The command chain must be wrapped in a single
# shell execution block using the exec form of CMD to span multiple operations.
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node --loader ts-node/esm src/app/lib/seeds/assign-superAdmin.ts && node --loader ts-node/esm src/app/lib/sync-permissions.ts && npm start"]