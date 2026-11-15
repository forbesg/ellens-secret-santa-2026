// GET /admin/:id/manifest.webmanifest?key=…: lets Ellen add her admin page to the home screen.
// Only works with the right key (404 otherwise, like the admin API).
export default defineEventHandler(async (event) => {
  const id = parseParam(event, 'id', idSchema)
  const key = getQuery(event).key
  const group = await findAdminGroup(id, key)
  if (!group) throw notFound()

  setHeader(event, 'Content-Type', 'application/manifest+json')
  setHeader(event, 'Cache-Control', 'no-store') // it contains the secret key
  return adminManifest(group.id, group.name, key as string)
})
