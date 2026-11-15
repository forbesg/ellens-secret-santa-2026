// Web app manifests, so the app can be added to a home screen.
// Pure functions (no I/O), so they're easy to test.
//
// The admin and reveal manifests are made per group / per person, because their
// start_url has to be the secret link itself. When the app is opened from the home
// screen there's no other way to know the key or token (on iPhone/iPad, home-screen
// apps don't even share storage with Safari).

const THEME = {
  display: 'standalone',
  background_color: '#fafaf9',
  theme_color: '#dc2626',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
} as const

export type WebAppManifest = typeof THEME & {
  id: string
  name: string
  short_name: string
  description: string
  start_url: string
  scope: string
}

/** The home page: start a new Secret Santa. */
export function homeManifest(): WebAppManifest {
  return {
    ...THEME,
    id: '/',
    name: 'Secret Santa',
    short_name: 'Secret Santa',
    description: 'A simple, secret family Secret Santa.',
    start_url: '/',
    scope: '/',
  }
}

/** Ellen's admin page for one group. start_url includes the admin key. */
export function adminManifest(groupId: string, groupName: string, adminKey: string): WebAppManifest {
  return {
    ...THEME,
    // The id leaves out the key, so the installed app is "this group's admin", not "this URL"
    id: `/admin/${groupId}`,
    name: `${groupName} (admin)`,
    short_name: 'Santa admin',
    description: `Run the ${groupName} Secret Santa.`,
    start_url: `/admin/${groupId}?key=${encodeURIComponent(adminKey)}`,
    scope: `/admin/${groupId}`,
  }
}

/** One person's reveal page. Never mentions who they're buying for. */
export function revealManifest(token: string, giverName: string, groupName: string): WebAppManifest {
  return {
    ...THEME,
    id: `/reveal/${token}`,
    name: `${groupName}: ${giverName}'s Secret Santa`,
    short_name: 'Secret Santa',
    description: `${giverName}'s secret link for ${groupName}.`,
    start_url: `/reveal/${token}`,
    scope: `/reveal/${token}`,
  }
}
