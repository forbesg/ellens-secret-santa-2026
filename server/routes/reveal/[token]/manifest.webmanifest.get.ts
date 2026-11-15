// GET /reveal/:token/manifest.webmanifest: lets someone add their reveal page to the home screen.
// Doesn't count as "seen it", and never mentions who they're buying for.
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  const found = await findReveal(token)
  if (!found) throw notFound(BROKEN_LINK)

  setHeader(event, 'Content-Type', 'application/manifest+json')
  setHeader(event, 'Cache-Control', 'no-store') // it contains the secret token
  return revealManifest(token!, found.participant.name, found.group.name)
})
