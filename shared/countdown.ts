// "How many sleeps until we swap presents?" Pure, so it's easy to test.

/**
 * Whole days from today to `isoDate` (YYYY-MM-DD), in the viewer's own time zone.
 * 0 means today, negative means it's already happened. null if the date isn't valid.
 */
export function daysToGo(isoDate: string, now: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return null
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const target = new Date(year, month - 1, day)
  // new Date() quietly rolls "2026-13-45" over into 2027, so check nothing moved
  if (target.getMonth() !== month - 1 || target.getDate() !== day) return null
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Math.round, not floor: a clock change (BST/GMT) makes some days 23 or 25 hours long
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
}

/** "🎄 12 sleeps to go!", or null once the day has passed (nothing to show). */
export function countdownText(isoDate: string, now: Date = new Date()): string | null {
  const days = daysToGo(isoDate, now)
  if (days === null || days < 0) return null
  if (days === 0) return '🎁 It\'s present day!'
  if (days === 1) return '🎄 1 sleep to go!'
  return `🎄 ${days} sleeps to go!`
}
