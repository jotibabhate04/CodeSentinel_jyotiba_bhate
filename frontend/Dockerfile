
# Stage 1: Build React + Vite Frontend
FROM node:20-alpine AS build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files
COPY . .

# Configure API base URL
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build production assets
RUN npm run build

# Stage 2: Serve production build with Nginx
FROM nginx:stable-alpine

# Upgrade Alpine OS packages
RUN apk update \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/share/nginx/html

# Remove default Nginx assets
RUN rm -rf ./*

# Copy production build
COPY --from=build /app/dist ./

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

