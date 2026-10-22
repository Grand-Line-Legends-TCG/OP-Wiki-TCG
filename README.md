This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy with Docker

The whole application runs in **one container**: a multi-stage `Dockerfile` produces a lightweight Next.js standalone image. No database, cache, or extra service is needed.

### Option 1 — VPS with an existing Nginx Proxy Manager (recommended)

NPM already handles ports 80/443 and SSL, so the app stays private. It joins NPM's Docker network and is reached as `op-tcg-app:3000`.

```bash
# 1. Find the Docker network used by NPM
docker network ls

# 2. Put its name in .env
echo "NPM_NETWORK=nginx-proxy-manager_default" >> .env

# 3. Build and start the app
docker compose -f docker-compose.npm.yml up -d --build
```

In NPM, create a **Proxy Host**:

| Field | Value |
|---|---|
| Domain | `tcg.example.com` |
| Scheme | `http` |
| Forward hostname | `op-tcg-app` |
| Forward port | `3000` |
| Websockets support | enabled |
| Block common exploits | enabled |
| SSL | Let's Encrypt + Force SSL |

NPM terminates TLS and proxies to the app over the shared Docker network.

### Option 2 — VPS without a reverse proxy

```bash
docker compose up -d --build
```

The app is available on `http://<vps-ip>:3000`.

### Option 3 — Build a single image

```bash
docker build -t op-tcg-next:latest .
docker run -d --name op-tcg-app -p 3000:3000 --restart unless-stopped op-tcg-next:latest
```

### Updating on the VPS

```bash
git pull

# With NPM:
docker compose -f docker-compose.npm.yml up -d --build

# Without a reverse proxy:
docker compose up -d --build
```

### Notes

- No database or external service is required; the app is fully self-contained.
- Copy `.env.example` to `.env` and adjust values if needed.
- The container exposes port `3000`. With NPM, no host port is published at all.
