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
- **Copy-paste links are a known soft spot for Golden Rule #1.** Right after the draw, the admin's page holds everyone's reveal links (it has to, so she can send them). The page never shows the matches, but opening someone else's link would. The UI asks her not to. Phase 2 email sending removes this, because links can go straight to each person.
- **Storage writes are read-modify-write on one KV value.** Two writes at the exact same moment (e.g. two people opening links in the same second) could lose a "viewed" tick. That's fine for a family app, and it never affects the draw itself.
- **Rate limit** is "roughly 10 new groups per IP per hour". The KV counter isn't atomic. The IP is hashed before it's used as a key.
- **`tests/api.test.ts`** builds the whole app with the `node-server` preset and in-memory storage, then tests over real HTTP. It takes about 30 seconds. It creates under 10 groups, so it stays below the rate limit. If you add more group-creating tests, keep that in mind.
