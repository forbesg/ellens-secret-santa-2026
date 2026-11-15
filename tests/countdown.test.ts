import { describe, expect, it } from 'vitest'
import { countdownText, daysToGo } from '#shared/countdown'

// Times are local, like a real tablet
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h)

describe('daysToGo', () => {
  it('counts whole days, whatever the time of day', () => {
    expect(daysToGo('2026-12-25', at(2026, 12, 13, 0))).toBe(12)
    expect(daysToGo('2026-12-25', at(2026, 12, 13, 23))).toBe(12)
  })

  it('is 0 on the day and negative afterwards', () => {
    expect(daysToGo('2026-12-25', at(2026, 12, 25))).toBe(0)
    expect(daysToGo('2026-12-25', at(2026, 12, 27))).toBe(-2)
  })

  it('works across month and year ends, and clock changes', () => {
    expect(daysToGo('2027-01-02', at(2026, 12, 30))).toBe(3)
    // UK clocks go back on 25 Oct 2026; still 2 days
    expect(daysToGo('2026-10-26', at(2026, 10, 24))).toBe(2)
  })

  it('returns null for dates it cannot read', () => {
    expect(daysToGo('not a date')).toBeNull()
    expect(daysToGo('2026-13-45')).toBeNull()
    expect(daysToGo('2026-02-30')).toBeNull()
    expect(daysToGo('')).toBeNull()
  })
})

describe('countdownText', () => {
  it('speaks kid', () => {
    expect(countdownText('2026-12-25', at(2026, 12, 13))).toBe('🎄 12 sleeps to go!')
    expect(countdownText('2026-12-25', at(2026, 12, 24))).toBe('🎄 1 sleep to go!')
    expect(countdownText('2026-12-25', at(2026, 12, 25))).toBe('🎁 It\'s present day!')
  })

  it('shows nothing once the day has passed', () => {
    expect(countdownText('2026-12-25', at(2026, 12, 26))).toBeNull()
  })
})
