// Finding a person from their reveal link.

import type { Group, Participant } from '#shared/types'
import { getGroup, getTokenEntry } from './store'
import { hashToken, isTokenShaped, safeEqual } from './tokens'

export const BROKEN_LINK = 'This link doesn\'t work any more. Ask the person running your Secret Santa for a new one.'

/** The group and person a reveal token belongs to, or null if the link isn't (or is no longer) valid. */
export async function findReveal(token: unknown): Promise<{ group: Group, participant: Participant } | null> {
  if (!isTokenShaped(token)) return null

  const tokenHash = await hashToken(token)
  const entry = await getTokenEntry(tokenHash)
  if (!entry) return null

  const group = await getGroup(entry.groupId)
  const participant = group?.participants.find(p => p.id === entry.participantId)
  // Double-check against the group itself, in case the index entry is stale
  if (!group || group.status !== 'drawn' || !participant?.tokenHash || !safeEqual(participant.tokenHash, tokenHash)) {
    return null
  }
  return { group, participant }
}
