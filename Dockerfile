###################
# Base image
###################
# Use Node Alpine as the base for a small, secure image
FROM node:20-alpine AS base

# Install npm latest globally
RUN npm install -g npm@latest
RUN npm install -g pnpm@latest

ENV PNPM_HOME="/root/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set fetch-retries 15
RUN pnpm config set fetch-retry-factor 15
RUN pnpm config set fetch-timeout 120000
RUN pnpm config set global-bin-dir /usr/local/bin
RUN pnpm config set store-dir /usr/src/app/.pnpm-store
RUN pnpm config set registry https://registry.npmmirror.com

# Set working directory
WORKDIR /usr/src/app

# Install pm2 globally to manage the application process
# RUN pnpm add --global pm2

###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM base AS development

# Copy package files and install dependencies
COPY package*.json pnpm-lock.yaml /usr/src/app/
RUN --mount=type=cache,target=/usr/src/app/.pnpm-store \
    pnpm install

# Verify that node_modules and prisma directory exists
RUN ls -la /usr/src/app/node_modules

COPY prisma /usr/src/app/prisma
RUN ls -la /usr/src/app/prisma
RUN pnpm dlx prisma generate --schema=/usr/src/app/prisma/schema.prisma

# Copy the rest of the application
COPY . /usr/src/app/

###################
# BUILD FOR PRODUCTION
###################
FROM base As build

# Set environment variable for production build
ENV NODE_ENV production

# Copy package files for installing dependencies
# Use dependencies from the development stage to save on install time
# Copy application source code
COPY package*.json pnpm-lock.yaml /usr/src/app/
COPY --from=development /usr/src/app/node_modules /usr/src/app/node_modules
COPY . /usr/src/app/

# Run the build command to compile the app
RUN --mount=type=cache,target=/usr/src/app/.pnpm-store \
    pnpm install --prod && pnpm run build

###################
# PRODUCTION
###################
FROM base As production

# Set environment variable for production
ENV NODE_ENV=production

# Copy your PM2 ecosystem file to the container
COPY ecosystem.config.js /usr/src/app/

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
RUN ls -a /usr/src/app/dist/
