import { applyAssetStyleVariables } from './assetStyles'

const ASSET_STYLE_PATHS = {
  '--start-screen-button-image': '/assets/images/start_button.png',
  '--start-screen-button-hover-image': '/assets/images/start_button_hover.png',
  '--start-button-yellow-image': '/assets/images/yellowsun.png',
  '--start-button-red-image': '/assets/images/redsun.png',
  '--start-guide-button-one-image': '/assets/images/guide_btn1.png',
  '--start-guide-button-two-image': '/assets/images/guide_btn2.png',
}

describe('applyAssetStyleVariables', () => {
  test('sets every CSS background image to the shared asset base URL', () => {
    const setProperty = vi.fn()

    applyAssetStyleVariables(
      { style: { setProperty } },
      'https://example.r2.dev/'
    )

    Object.entries(ASSET_STYLE_PATHS).forEach(([property, path]) => {
      expect(setProperty).toHaveBeenCalledWith(
        property,
        `url("https://example.r2.dev${path}")`
      )
    })
  })

  test('keeps existing local asset paths when the base URL is empty', () => {
    const setProperty = vi.fn()

    applyAssetStyleVariables({ style: { setProperty } }, '')

    Object.entries(ASSET_STYLE_PATHS).forEach(([property, path]) => {
      expect(setProperty).toHaveBeenCalledWith(property, `url("${path}")`)
    })
  })
})
