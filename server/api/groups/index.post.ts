// POST /api/groups: start a new Secret Santa. Returns the secret admin link.
import type { CreateGroupResponse, Group } from '#shared/types'

export default defineEventHandler(async (event): Promise<CreateGroupResponse> => {
  // Basic rate limit per (hashed) IP address (runtimeConfig.groupsPerHour, 10 by default)
  const { groupsPerHour } = useRuntimeConfig(event)
  const ip = getHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const allowed = await hitRateLimit(await hashToken(`groups:${ip}`), groupsPerHour)
  if (!allowed) {
    throw friendlyError(429, 'Whoa, that\'s a lot of Secret Santas! Please wait a little while and try again.')
  }

  const body = await parseBody(event, createGroupSchema)
  const adminKey = generateToken()

  const group: Group = {
    id: generateId(10),
    name: body.name,
    budget: body.budget,
    exchangeDate: body.exchangeDate,
    createdAt: new Date().toISOString(),
    adminKeyHash: await hashToken(adminKey),
    status: 'draft',
    participants: [],
  }
  await saveGroup(group)

  setResponseStatus(event, 201)
  return {
    group: toAdminView(group),
    adminUrl: `${siteOrigin(event)}/admin/${group.id}?key=${adminKey}`,
  }
})
