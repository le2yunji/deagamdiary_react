import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  buildAssetInventory,
  extractAssetReferences,
  getContentType,
  validateAssetEntries,
  validateObjectKey,
  validateReferencedAssets,
} from './r2Assets.mjs'

test('builds file metadata from a controlled asset source', async (context) => {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'r2-assets-'))
  context.after(() => rm(sourceRoot, { force: true, recursive: true }))
  await mkdir(path.join(sourceRoot, 'public/assets/models'), { recursive: true })
  await writeFile(
    path.join(sourceRoot, 'public/assets/models/Player.glb'),
    'potato'
  )
  const entries = [
    {
      objectKey: 'assets/models/Player.glb',
      sourcePath: 'public/assets/models/Player.glb',
      kind: 'model',
      status: 'required',
    },
  ]

  const inventory = await buildAssetInventory(entries, {
    sourceRoot,
    trackedPaths: new Set(['public/assets/models/Player.glb']),
    referencesByObjectKey: new Map([
      ['assets/models/Player.glb', ['src/components/Player.jsx']],
    ]),
  })

  assert.deepEqual(inventory, [
    {
      objectKey: 'assets/models/Player.glb',
      sourcePath: 'public/assets/models/Player.glb',
      kind: 'model',
      status: 'required',
      size: 6,
      sha256: 'e91c254ad58860a02c788dfb5c1a65d6a8846ab1dc649631c7db16fef4af2dec',
      gitTracked: true,
      references: ['src/components/Player.jsx'],
    },
  ])
})

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
    const dynamicModel = \`/assets/models/\${name}.glb\`
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

test('does not treat HTML comments as runtime references', () => {
  const source = `
    <img src="/assets/images/visible.png" />
    <!-- <video src="/assets/video/hidden.mp4"></video> -->
  `

  assert.deepEqual(
    extractAssetReferences(source, 'public/index.html'),
    ['assets/images/visible.png']
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

test('accepts a runtime reference documented as an excluded broken asset', () => {
  const entries = [
    {
      objectKey: 'assets/audio/missing.mp3',
      status: 'excluded',
      reason: 'Known broken reference without a source file',
    },
  ]

  assert.doesNotThrow(() => validateReferencedAssets(
    ['assets/audio/missing.mp3'],
    entries
  ))
})
