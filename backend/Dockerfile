# CodeSentinel Backend Dockerfile
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /usr/src/app

# Copy dependency manifests and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend source code
COPY src ./src

# Run as non-root user for container security
USER node

# Expose Express REST API port
EXPOSE 5000

# Health check against existing /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

# Start application using existing npm start script
CMD ["npm", "start"]
