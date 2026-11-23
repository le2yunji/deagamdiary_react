import { getAssetUrl } from './assetUrl'

describe('getAssetUrl', () => {
  test('keeps a root-relative path when the asset base URL is empty', () => {
    expect(getAssetUrl('/assets/models/Gamza_cycle.glb', '')).toBe(
      '/assets/models/Gamza_cycle.glb'
    )
  })

  test('removes a trailing slash from the asset base URL', () => {
    expect(
      getAssetUrl(
        '/assets/models/Gamza_cycle.glb',
        'https://example.r2.dev/'
      )
    ).toBe('https://example.r2.dev/assets/models/Gamza_cycle.glb')
  })

  test('adds a leading slash to the asset path', () => {
    expect(
      getAssetUrl('assets/models/Gamza_cycle.glb', 'https://example.r2.dev')
    ).toBe('https://example.r2.dev/assets/models/Gamza_cycle.glb')
  })
})
