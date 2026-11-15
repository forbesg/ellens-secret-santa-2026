// Swap the page's web app manifest for a personal one, so "Add to Home Screen"
// opens straight back to this secret link (see server/utils/manifest.ts).
// Until `manifest` is set, the page keeps the home page's manifest.

export function usePwaManifest(manifest: Ref<{ href: string, appTitle: string } | null>) {
  useHead({
    link: () => (manifest.value ? [{ rel: 'manifest', href: manifest.value.href, key: 'manifest' }] : []),
    meta: () => (manifest.value
      ? [{ name: 'apple-mobile-web-app-title', content: manifest.value.appTitle }]
      : []),
  })
}
