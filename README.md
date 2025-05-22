# Opus Classical

[![CI](https://github.com/Droidion/opus-classical-hono/actions/workflows/ci.yml/badge.svg)](https://github.com/Droidion/opus-classical-hono/actions/workflows/ci.yml)

Now with ho and bun!

Have bun installed.

Install dependencies:
```sh
bun install
```

Create a `.env` file in the root directory with the following:

```dotenv
DATABASE_URL=postgresql://user:password@neon.tech/opusclassical?sslmode=require
PUBLIC_IMAGES_URL=https://s3.domain.net
PORT=3000
```

## Run in dev mode

Use 2 tabs in the the terminal.

Run tailwind and hono server in parallel in these 2 tabs:
```sh
bun run dev:css
bun run dev
```

Open http://localhost:3000
