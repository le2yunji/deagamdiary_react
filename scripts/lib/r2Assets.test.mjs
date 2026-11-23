import assert from 'node:assert/strict'
import test from 'node:test'

import {
  extractAssetReferences,
  getContentType,
  validateAssetEntries,
  validateObjectKey,
  validateReferencedAssets,
} from './r2Assets.mjs'

test('rejects an object key outside the assets directory', () => {
  assert.throws(
    () => validateObjectKey('models/player.glb'),
    /assets\//
  )
})

test('rejects macOS metadata files', () => {
  assert.throws(
    () => validateObjectKey('assets/images/.DS_Store'),
    /DS_Store/
  )
})

test('accepts matching duplicate object keys', () => {
  const entries = [
    {
      objectKey: 'assets/images/poster.png',
      sourcePath: 'public/assets/images/poster.png',
      sha256: 'same-hash',
    },
    {
      objectKey: 'assets/images/poster.png',
      sourcePath: 'src/assets/images/poster.png',
      sha256: 'same-hash',
    },
  ]

  assert.doesNotThrow(() => validateAssetEntries(entries))
})

test('rejects conflicting files that share an object key', () => {
  const entries = [
    {
      objectKey: 'assets/video/ending.webm',
      sourcePath: 'public/assets/video/ending.webm',
      sha256: 'public-hash',
    },
    {
      objectKey: 'assets/video/ending.webm',
      sourcePath: 'src/assets/video/ending.webm',
      sha256: 'src-hash',
    },
  ]

  assert.throws(() => validateAssetEntries(entries), /conflict/i)
})

test('returns browser content types for migrated asset extensions', () => {
  assert.equal(getContentType('player.glb'), 'model/gltf-binary')
  assert.equal(getContentType('poster.webp'), 'image/webp')
  assert.equal(getContentType('voice.mp3'), 'audio/mpeg')
  assert.equal(getContentType('ending.webm'), 'video/webm')
  assert.equal(getContentType('Pretendard.json'), 'application/json')
})

test('extracts active asset references and ignores comments', () => {
  const source = `
    const model = getAssetUrl('/assets/models/Player.glb')
    const image = '/assets/images/poster.png'
    // const oldImage = '/assets/images/old.png'
    /* const oldVideo = '/assets/video/old.webm' */
  `

  assert.deepEqual(
    extractAssetReferences(source, 'src/components/Player.jsx'),
    [
      'assets/images/poster.png',
      'assets/models/Player.glb',
    ]
  )
})

test('does not treat test fixtures as runtime references', () => {
  const source = "getAssetUrl('/assets/models/Test.glb')"

  assert.deepEqual(
    extractAssetReferences(source, 'src/utils/assetUrl.test.js'),
    []
  )
})

test('rejects a runtime reference missing from the required asset list', () => {
  const entries = [
    {
      objectKey: 'assets/models/Player.glb',
      sourcePath: 'public/assets/models/Player.glb',
      status: 'required',
    },
  ]

  assert.throws(
    () => validateReferencedAssets(
      ['assets/models/Player.glb', 'assets/audio/voice.mp3'],
      entries
    ),
    /assets\/audio\/voice\.mp3/
  )
})
