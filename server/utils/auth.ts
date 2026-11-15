// Admin access is by secret key only (no accounts).
// The key arrives in the x-admin-key header. We hash it and compare with the stored hash.
// Wrong group OR wrong key both give 404, so nobody can find out which group ids exist.

import type { H3Event } from 'h3'
import type { Group } from '#shared/types'
import { notFound, parseParam } from './errors'
import { idSchema } from './schemas'
import { getGroup } from './store'
import { hashToken, isTokenShaped, safeEqual } from './tokens'

/** The group, if `key` is its admin key. Otherwise null (never says which part was wrong). */
export async function findAdminGroup(id: string, key: unknown): Promise<Group | null> {
  if (!isTokenShaped(key)) return null

  const group = await getGroup(id)
  if (!group) return null

  const keyHash = await hashToken(key)
  return safeEqual(keyHash, group.adminKeyHash) ? group : null
}

export async function requireAdmin(event: H3Event): Promise<Group> {
  const id = parseParam(event, 'id', idSchema)
  const group = await findAdminGroup(id, getHeader(event, 'x-admin-key'))
  if (!group) throw notFound()
  return group
}

/** People can only be added or removed before the draw. */
export function requireDraft(group: Group) {
  if (group.status !== 'draft') {
    throw createError({
      statusCode: 409,
      message: 'The names have already been drawn. Press "Start again" if you want to change who\'s in.',
    })
  }
}
