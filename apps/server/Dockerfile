FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/server/package.json apps/server/

RUN bun install --cwd apps/server

COPY . .

RUN bun build --compile --minify-whitespace --minify-syntax --target bun --outfile apps/server/dist/server apps/server/src/index.ts

FROM debian:bullseye-slim AS rbase
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/apps/server/dist/server /app/server

FROM rbase AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 app

USER app

EXPOSE 3000
ENV PORT=3000
CMD ["/app/server"]
