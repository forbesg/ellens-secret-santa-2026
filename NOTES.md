# Notes & decisions

Choices made where CLAUDE.md was unclear (simplest option that keeps the Golden Rules).

## Phase 1

- **TypeScript is pinned to 6.x.** TS 7 is the native (Go) compiler, and `vue-tsc` (used by `nuxt typecheck`) still needs the JS compiler API.
- **Admin and reveal pages render client-side only** (`ssr: false` in `routeRules`). The secrets are in the URL anyway, and it means link-preview bots in WhatsApp/iMessage (which fetch the page but don't run JS) never mark a reveal as "✅ Seen it" and never see the recipient's name.
- **"Viewed" is set when the reveal page loads**, not when the gift box is tapped. That keeps the API to a single GET.
- **New link for one person** is `POST /api/groups/:id/participants/:pid/link`. It rotates that person's token (their old link stops working) and keeps the same match. `viewedAt` is left as it was.
- **"Start again" (reset)** puts the group back to draft. The admin can then change people and press "Do the draw!" again, which returns fresh links.
- **Duplicate names aren't allowed** in one group (case-insensitive), since the reveal page only shows names.
- **The exchange date must be between yesterday and 2 years from now.** A date in the past would make KV expire the group almost straight away.
- **Group details (name/budget/date) can be edited after the draw.** It doesn't affect any match.
- **Copy-paste links are a known soft spot for Golden Rule #1.** Right after the draw, the admin's page holds everyone's reveal links (it has to, so she can send them). The page never shows the matches, but opening someone else's link would. The UI asks her not to. With the share button she sends each link straight from her device, so she has no reason to open it, but she still could. That's the trade-off of having no email or accounts.
- **Storage writes are read-modify-write on one KV value.** Two writes at the exact same moment (e.g. two people opening links in the same second) could lose a "viewed" tick. That's fine for a family app, and it never affects the draw itself.
- **Rate limit** is "roughly 10 new groups per IP per hour". The KV counter isn't atomic. The IP is hashed before it's used as a key.
- **`tests/api.test.ts`** builds the whole app with the `node-server` preset and in-memory storage, then tests over real HTTP. It takes about 30 seconds. It creates under 10 groups, so it stays below the rate limit. If you add more group-creating tests, keep that in mind.
- **No email (decided 2026-11-15).** Links are shared through the device's share sheet (Web Share API) or by copy/paste, so we don't collect email addresses at all, per Golden Rule #6. The add-person API ignores an `email` field if one is sent. Groups created during development before this change may still have an `email` stored, but it's never returned and expires with the group.
- **The share button needs HTTPS.** Browsers only offer `navigator.share` (and clipboard copy) on HTTPS or `localhost`. Production on Cloudflare is HTTPS. To test on a tablet in dev, run `pnpm dev --https --host 0.0.0.0` (`--host` must come after `--https`, or it takes `--https` as the hostname).

## Add to Home Screen (PWA)

- **The admin and reveal manifests are per link.** Their `start_url` is the secret link, key or token included. It has to be: the admin page strips `?key=` from the address bar, and on iPhone/iPad a home-screen app doesn't share storage with Safari, so a plain `/admin/<id>` icon would open without the key. The server builds the manifest (`server/routes/`) after checking the key or token. A `blob:`/`data:` manifest made in the browser wouldn't work, because browsers ignore `start_url` from a different origin.
- **The secret ends up stored with the home-screen icon on the device.** That's the same as a bookmark. Manifest responses are `no-store`.
- **The admin manifest's `id` leaves the key out** (`/admin/<id>`), so the installed app means "this group's admin", not "this URL".
- **A personal manifest is only swapped in once the key/token has worked** (`usePwaManifest`), so a broken link never offers to install a broken app.
- **Fetching the reveal manifest doesn't mark the person as "seen it".** Only the reveal API does.
- **There's no service worker or offline mode.** Chrome no longer needs one before it offers "Install", and the app needs the internet anyway. That's one less dependency (`@vite-pwa/nuxt`).
- **No global `apple-mobile-web-app-title`.** The SPA shell's copy wouldn't be replaced by the page's own, leaving two, so iOS falls back to `<title>` on the home page.
- **A "new link" or "Start again" breaks home-screen icons.** The old token or key in `start_url` stops working, so the person needs to add the new link to their home screen again.
- **The group rate limit is `runtimeConfig.groupsPerHour`** (10, or set `NUXT_GROUPS_PER_HOUR`). `tests/api.test.ts` raises it so the tests don't hit it.
