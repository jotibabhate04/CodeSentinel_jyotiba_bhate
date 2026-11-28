
# CodeSentinel Backend Dockerfile
FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /usr/src/app

# Upgrade Alpine OS packages and npm
RUN apk update \
    && apk upgrade --no-cache \
    && npm install -g npm@11.21.3 \
    && npm cache clean --force

# Install application production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy backend source code
COPY src ./src

# Run as non-root user
USER node

EXPOSE 5000

# Application health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

CMD ["npm", "start"]
