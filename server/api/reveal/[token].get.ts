// GET /api/reveal/:token: one person's reveal. Shows only who THEY are buying for.
export default defineEventHandler(async (event) => {
  const found = await findReveal(getRouterParam(event, 'token'))
  if (!found) throw notFound(BROKEN_LINK)
  const { group, participant } = found

  const view = toRevealView(group, participant.id)
  if (!view) throw notFound(BROKEN_LINK)

  if (!participant.viewedAt) {
    participant.viewedAt = new Date().toISOString()
    await saveGroup(group)
  }
  return view
})
