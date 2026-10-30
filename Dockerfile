# Stage 1: Dependencies installation
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Application build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application with standalone output
RUN npm run build

# Stage 3: Production runner (Non-root least privilege)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create dedicated non-root system group and user (UID/GID 1001)
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone artifact, public assets, and static files with non-root ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user (Principle of Least Privilege)
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

