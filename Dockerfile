FROM oven/bun AS build

WORKDIR /app

COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Run the vite build command from package json
RUN NODE_ENV=prod bun run build

FROM ubuntu:22.04

WORKDIR /app

# copy the compiled files from the build image
COPY --from=build /app/dist /app
