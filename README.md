# 🎅 Secret Santa

A small family Secret Santa web app. The admin creates a group, adds people, presses **Do the draw!**, and sends each person their own secret link. Each link shows only who *that* person is buying for. Nobody, not even the admin, can see the full list.

See `CLAUDE.md` for the full design and rules, and `NOTES.md` for decisions made along the way.

## Running it locally

Needs Node 24.11+ (or 22.21+) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000, data saved in .data/santa
pnpm test         # unit tests + an end-to-end API test (~30s)
pnpm typecheck
pnpm lint
```

## Deploying to Cloudflare Workers

Live at https://secret-santa.fnbg75.workers.dev/. The KV namespace (`SANTA`) already exists, and its id is in `wrangler.jsonc`.

**Automatic deploys:** every push to `main` is built and deployed by Cloudflare Workers Builds, once the repo is connected (Worker → Settings → Build):

- Branch: `main`
- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`

Each build shows up as a check on the commit in GitHub.

**Deploying by hand** (needs `pnpm wrangler login` first):

```bash
pnpm build
pnpm deploy
```

To use your own domain, add a custom domain to the Worker in the Cloudflare dashboard.

Groups delete themselves automatically about 60 days after the exchange date (or 120 days after they were made if there's no date).

### Trying the production build locally

```bash
pnpm build
pnpm wrangler dev   # uses a local, simulated KV
```

