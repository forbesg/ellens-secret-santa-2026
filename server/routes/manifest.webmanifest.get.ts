// GET /manifest.webmanifest: the home page's manifest.
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/manifest+json')
  return homeManifest()
})
