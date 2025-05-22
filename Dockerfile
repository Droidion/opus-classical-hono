FROM oven/bun:1 AS deps
WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM oven/bun:1 AS runner
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["bun", "run", "src/server.ts"] 