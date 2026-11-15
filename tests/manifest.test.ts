import { describe, expect, it } from 'vitest'
import { adminManifest, homeManifest, revealManifest } from '../server/utils/manifest'

describe('web app manifests', () => {
  it('home page starts at /', () => {
    const m = homeManifest()
    expect(m.start_url).toBe('/')
    expect(m.scope).toBe('/')
    expect(m.icons.map(i => i.sizes)).toContain('512x512')
  })

  it('admin app opens straight to the secret admin link, scoped to that group', () => {
    const m = adminManifest('abc123defg', 'Smith Christmas', 'KEY_with-chars_123')
    expect(m.start_url).toBe('/admin/abc123defg?key=KEY_with-chars_123')
    expect(m.scope).toBe('/admin/abc123defg')
    expect(m.id).toBe('/admin/abc123defg') // the key is not part of the app's identity
    expect(m.name).toContain('Smith Christmas')
  })

  it('reveal app opens straight to that person\'s reveal link', () => {
    const m = revealManifest('TOKEN', 'Sam', 'Smith Christmas')
    expect(m.start_url).toBe('/reveal/TOKEN')
    expect(m.scope).toBe('/reveal/TOKEN')
    expect(m.name).toContain('Sam')
  })
})
