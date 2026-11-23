import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  buildAssetInventory,
  buildAwsUploadArgs,
  extractAssetReferences,
  findUnmanagedAssetReferences,
  findRawGlbReferences,
  findRawRuntimeAssetReferences,
  getContentType,
  validateAssetBuffer,
  validateAssetEntries,
  validateObjectKey,
  validateRemoteAssetResponse,
  validateReferencedAssets,
} from './r2Assets.mjs'

test('finds unmanaged asset URLs but permits shared R2 URL mechanisms', () => {
  assert.deepEqual(
    findUnmanagedAssetReferences(
      '<img src="/assets/images/raw.png">',
      'public/index.html'
    ),
    ['assets/images/raw.png']
  )
  assert.deepEqual(
    findUnmanagedAssetReferences(
      'background: url("./assets/images/raw.png")',
      'src/index.css'
    ),
    ['assets/images/raw.png']
  )
  assert.deepEqual(
    findUnmanagedAssetReferences(
      "const image = '/assets/images/raw.png'",
      'src/App.jsx'
    ),
    ['assets/images/raw.png']
  )

  assert.deepEqual(
    findUnmanagedAssetReferences(
      '<img src="%REACT_APP_ASSET_BASE_URL%/assets/images/safe.png">',
      'public/index.html'
    ),
    []
  )
  assert.deepEqual(
    findUnmanagedAssetReferences(
      "const image = getAssetUrl('/assets/images/safe.png')",
      'src/App.jsx'
    ),
    []
  )
  assert.deepEqual(
    findUnmanagedAssetReferences(
      'background: var(--safe-image)',
      'src/index.css'
    ),
    []
  )
})

test('allows documented central style paths and unused component exclusions', () => {
  assert.deepEqual(
    findUnmanagedAssetReferences(
      "const path = '/assets/images/button.png'",
      'src/utils/assetStyles.js'
    ),
    []
  )
  assert.deepEqual(
    findUnmanagedAssetReferences(
      "useGLTF('/assets/models/old.glb')",
      'src/components/Coffee.jsx'
    ),
    []
  )
})

test('finds raw runtime media paths but allows getAssetUrl constants', () => {
  const source = `
    const texture = useTexture('/assets/images/raw.png')
    loader.load('/assets/images/loaded.webp', callback)
    <ManualAudioPlayer url="/assets/audio/voice.mp3" />
    <img src="/assets/images/dom.png" />
    const safeUrl = getAssetUrl('/assets/images/safe.png')
  `

  assert.deepEqual(findRawRuntimeAssetReferences(source), [
    'assets/audio/voice.mp3',
    'assets/images/dom.png',
    'assets/images/loaded.webp',
    'assets/images/raw.png',
  ])
})

test('finds raw GLB loader paths but allows getAssetUrl constants', () => {
  const source = `
    const rawModel = useGLTF('/assets/models/Raw.glb')
    useGLTF.preload('/assets/models/Raw.glb')
    const rawUrls = names.map((name) => \`/assets/models/\${name}.glb\`)
    const safeUrl = getAssetUrl('/assets/models/Safe.glb')
    const safeModel = useGLTF(safeUrl)
  `

  assert.deepEqual(findRawGlbReferences(source), [
    'assets/models/${name}.glb',
    'assets/models/Raw.glb',
  ])
})

test('runtime component GLB loaders use the shared asset URL helper', async () => {
  const componentFiles = [
    'src/components/AlbaBoard.jsx',
    'src/components/AlbaGamza.jsx',
    'src/components/AlbaPosters.jsx',
    'src/components/Bakery.jsx',
    'src/components/BakeryGamza.jsx',
    'src/components/BamGoguma.jsx',
    'src/components/Cafe.jsx',
    'src/components/CafeGamza.jsx',
    'src/components/ChatGPT.jsx',
    'src/components/Classroom.jsx',
    'src/components/ClassroomGamza.jsx',
    'src/components/Escalator.jsx',
    'src/components/File.jsx',
    'src/components/MailBox.jsx',
    'src/components/MailGamza.jsx',
    'src/components/Metro.jsx',
    'src/components/NomoneyGamza.jsx',
    'src/components/Onion.jsx',
    'src/components/Player.jsx',
    'src/components/PlayerController.jsx',
  ]
  const violations = []

  for (const filePath of componentFiles) {
    const source = await readFile(filePath, 'utf8')
    for (const reference of findRawGlbReferences(source)) {
      violations.push(`${filePath}: ${reference}`)
    }
  }

  assert.deepEqual(violations, [])
})

test('runtime scenes use the shared asset URL helper for media', async () => {
  const runtimeFiles = [
    'src/components/Ground.jsx',
    'src/components/PlayerController.jsx',
    'src/scenes/AlbaScene.jsx',
    'src/scenes/BakeryScene.jsx',
    'src/scenes/CafeScene.jsx',
    'src/scenes/ChatGPTScene.jsx',
    'src/scenes/ClassroomScene.jsx',
    'src/scenes/EscalatorScene.jsx',
    'src/scenes/MailScene.jsx',
    'src/scenes/MetroScene.jsx',
    'src/scenes/NomoneyScene.jsx',
  ]
  const violations = []

  for (const filePath of runtimeFiles) {
    const source = await readFile(filePath, 'utf8')
    for (const reference of findRawRuntimeAssetReferences(source)) {
      violations.push(`${filePath}: ${reference}`)
    }
  }

  assert.deepEqual(violations, [])
})

test('builds an R2 upload command without credentials', () => {
  const asset = {
    objectKey: 'assets/models/Player.glb',
    sourcePath: 'public/assets/models/Player.glb',
  }

  assert.deepEqual(
    buildAwsUploadArgs(asset, {
      bucket: 'i-am-talking-potato',
      endpointUrl: 'https://account-id.r2.cloudflarestorage.com',
      sourceRoot: '/source',
    }),
    [
      's3',
      'cp',
      '/source/public/assets/models/Player.glb',
      's3://i-am-talking-potato/assets/models/Player.glb',
      '--endpoint-url',
      'https://account-id.r2.cloudflarestorage.com',
      '--content-type',
      'model/gltf-binary',
      '--region',
      'auto',
      '--only-show-errors',
    ]
  )
})

test('rejects a local asset whose hash differs from the inventory', () => {
  const asset = {
    objectKey: 'assets/models/Player.glb',
    size: 6,
    sha256: 'wrong-hash',
  }

  assert.throws(
    () => validateAssetBuffer(asset, Buffer.from('potato')),
    /SHA-256/
  )
})

test('accepts a matching remote R2 response and CORS origin', () => {
  const asset = {
    objectKey: 'assets/models/Player.glb',
    size: 6,
  }
  const response = new Response(null, {
    status: 200,
    headers: {
      'access-control-allow-origin': 'http://localhost:3000',
      'content-length': '6',
      'content-type': 'model/gltf-binary',
    },
  })

  assert.doesNotThrow(() => validateRemoteAssetResponse(
    asset,
    response,
    'http://localhost:3000'
  ))
})

test('accepts wildcard CORS for public R2 assets', () => {
  const asset = {
    objectKey: 'assets/models/Player.glb',
    size: 6,
  }
  const response = new Response(null, {
    status: 200,
    headers: {
      'access-control-allow-origin': '*',
      'content-length': '6',
      'content-type': 'model/gltf-binary',
    },
  })

  assert.doesNotThrow(() => validateRemoteAssetResponse(
    asset,
    response,
    'http://localhost:4173'
  ))
})

test('rejects a remote R2 response without the requested CORS origin', () => {
  const asset = {
    objectKey: 'assets/models/Player.glb',
    size: 6,
  }
  const response = new Response(null, {
    status: 200,
    headers: {
      'content-length': '6',
      'content-type': 'model/gltf-binary',
    },
  })

  assert.throws(
    () => validateRemoteAssetResponse(
      asset,
      response,
      'http://localhost:3000'
    ),
    /CORS/
  )
})

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
