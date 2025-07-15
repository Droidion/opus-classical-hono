# Opus Classical

[![CI](https://github.com/Droidion/opus-classical-hono/actions/workflows/ci.yml/badge.svg)](https://github.com/Droidion/opus-classical-hono/actions/workflows/ci.yml)

Catalogue for streaming classical music.

## Stack

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [htmx](https://htmx.org/)
- [hyperscript](https://hyperscript.org/)
- [Drizzle](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)
- [Biome](https://biomejs.dev/)

## Run locally

Have [Bun](https://bun.sh/) installed.

Have database available (not part of this repo).

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

Use 2 tabs in the the terminal. Run tailwind and hono server in parallel in these 2 tabs:

```sh
bun run dev:css
bun run dev
```

Open http://localhost:3000

## Testing and linting

Run tests:

```sh
bun run test
```

Or with coverage:

```sh
bun run test:coverage
```

Run linting:

```sh
bun run lint
```

Or fix linting and formatting:

```sh
bun run lint:fix
```

## Updating dependencies

Update bun packages with `$ bun outdated`.

Update CDN scripts:

- Check out new versions on [unpkg](https://unpkg.com/)
- Generate the integrity hash with:
  ```sh
  curl -s https://unpkg.com/htmx.org@2.0.6/dist/htmx.min.js | openssl dgst -sha384 -binary | openssl base64 -A
  ```
- Update the integrity hashes in `src/components/partials/HeaderLinks.tsx` and `src/config/plugins.ts`.

## Deployment

Deployment is handled with [Dockploy](https://dokploy.com) and [Docker](https://www.docker.com/).

You can check docker image running locally with:

```sh
docker compose up
```

You should still have `.env` file set up or provide the same environment variables as in the `.env.example` file.