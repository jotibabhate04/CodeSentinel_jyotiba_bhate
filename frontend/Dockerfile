# Stage 1: Build React + Vite Frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests for deterministic dependency installation
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files
COPY . .

# Configure API base URL to use relative /api path for Nginx reverse proxy
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build production static assets into /app/dist
RUN npm run build

# Stage 2: Serve production build with Nginx
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy compiled Vite bundle from build stage
COPY --from=build /app/dist ./

# Copy custom Nginx configuration with SPA fallback and /api proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
