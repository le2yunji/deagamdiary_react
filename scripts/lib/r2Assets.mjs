import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES = new Map([
  ['.gif', 'image/gif'],
  ['.glb', 'model/gltf-binary'],
  ['.json', 'application/json'],
  ['.mp3', 'audio/mpeg'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
])

const UNMANAGED_REFERENCE_EXCLUSIONS = new Set([
  'src/components/AlbaPosters copy.jsx',
  'src/components/Coffee.jsx',
  'src/components/Escalator copy.jsx',
  'src/components/NomoneyBank.jsx',
  'src/utils/assetStyles.js',
])

/** 파일 종류별로 공통 R2 주소 장치를 거치지 않은 실행 에셋 경로를 찾는다. */
export function findUnmanagedAssetReferences(source, filePath) {
  const normalizedFilePath = filePath.replaceAll('\\', '/')

  if (
    /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(normalizedFilePath) ||
    UNMANAGED_REFERENCE_EXCLUSIONS.has(normalizedFilePath)
  ) {
    return []
  }

  if (normalizedFilePath.endsWith('.html')) {
    const withoutManagedPlaceholders = source.replaceAll(
      '%REACT_APP_ASSET_BASE_URL%/assets/',
      'managed/'
    )
    return extractAssetReferences(withoutManagedPlaceholders, filePath)
  }

  if (normalizedFilePath.endsWith('.css')) {
    const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '')
    const references = withoutComments.match(
      /(?:\.\/|\/)?assets\/[A-Za-z0-9_./-]+/g
    ) ?? []

    return [...new Set(
      references.map((reference) => reference.replace(/^(?:\.\/|\/)/, ''))
    )].sort()
  }

  return findRawRuntimeAssetReferences(source)
}

/** 인벤토리 항목을 자격 증명이 포함되지 않은 AWS CLI 업로드 인자로 바꾼다. */
export function buildAwsUploadArgs(asset, options) {
  const { bucket, endpointUrl, sourceRoot } = options

  return [
    's3',
    'cp',
    path.join(sourceRoot, asset.sourcePath),
    `s3://${bucket}/${asset.objectKey}`,
    '--endpoint-url',
    endpointUrl,
    '--content-type',
    getContentType(asset.objectKey),
    '--region',
    'auto',
    '--only-show-errors',
  ]
}

/** 업로드 직전 파일 내용이 인벤토리의 크기와 SHA-256에 맞는지 검사한다. */
export function validateAssetBuffer(asset, fileBuffer) {
  if (fileBuffer.byteLength !== asset.size) {
    throw new Error(
      `Size mismatch for ${asset.objectKey}: ` +
      `expected ${asset.size}, received ${fileBuffer.byteLength}`
    )
  }

  const sha256 = createHash('sha256').update(fileBuffer).digest('hex')
  if (sha256 !== asset.sha256) {
    throw new Error(
      `SHA-256 mismatch for ${asset.objectKey}: ` +
      `expected ${asset.sha256}, received ${sha256}`
    )
  }

  return asset
}

/** 공개 R2 응답의 상태·크기·형식·CORS가 인벤토리와 맞는지 검사한다. */
export function validateRemoteAssetResponse(asset, response, expectedOrigin) {
  if (response.status !== 200) {
    throw new Error(
      `Unexpected status for ${asset.objectKey}: ${response.status}`
    )
  }

  const contentLength = Number(response.headers.get('content-length'))
  if (contentLength !== asset.size) {
    throw new Error(
      `Content-Length mismatch for ${asset.objectKey}: ` +
      `expected ${asset.size}, received ${contentLength}`
    )
  }

  const contentType = response.headers.get('content-type')?.split(';')[0]
  const expectedContentType = getContentType(asset.objectKey)
  if (contentType !== expectedContentType) {
    throw new Error(
      `Content-Type mismatch for ${asset.objectKey}: ` +
      `expected ${expectedContentType}, received ${contentType}`
    )
  }

  const allowedOrigin = response.headers.get('access-control-allow-origin')
  if (allowedOrigin !== expectedOrigin) {
    throw new Error(
      `CORS mismatch for ${asset.objectKey}: ` +
      `expected ${expectedOrigin}, received ${allowedOrigin}`
    )
  }

  return asset
}

/** 원본 파일의 크기·해시·Git 상태·참조 위치를 인벤토리 항목에 더한다. */
export async function buildAssetInventory(entries, options) {
  const {
    sourceRoot,
    trackedPaths = new Set(),
    referencesByObjectKey = new Map(),
  } = options
  const inventory = []

  for (const entry of entries) {
    let fileBuffer = null

    if (entry.sourcePath) {
      try {
        fileBuffer = await readFile(path.join(sourceRoot, entry.sourcePath))
      } catch (error) {
        if (entry.status === 'required') {
          throw new Error(
            `Missing required asset source: ${entry.sourcePath}`,
            { cause: error }
          )
        }
      }
    }

    inventory.push({
      ...entry,
      size: fileBuffer?.byteLength ?? null,
      sha256: fileBuffer
        ? createHash('sha256').update(fileBuffer).digest('hex')
        : null,
      gitTracked: entry.sourcePath
        ? trackedPaths.has(entry.sourcePath)
        : false,
      references: referencesByObjectKey.get(entry.objectKey) ?? [],
    })
  }

  return inventory
}

/** R2 객체 키가 허용된 assets 경로인지 검사한다. */
export function validateObjectKey(objectKey) {
  if (!objectKey.startsWith('assets/')) {
    throw new Error(`R2 object key must start with assets/: ${objectKey}`)
  }

  if (objectKey.split('/').includes('.DS_Store')) {
    throw new Error(`R2 object key must not include .DS_Store: ${objectKey}`)
  }

  return objectKey
}

/** 파일 확장자를 브라우저 응답용 Content-Type으로 바꾼다. */
export function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  const contentType = CONTENT_TYPES.get(extension)

  if (!contentType) {
    throw new Error(`Unsupported asset extension: ${extension || filePath}`)
  }

  return contentType
}

/** GLB 로더에 공통 URL 헬퍼 없이 직접 전달된 에셋 경로를 찾는다. */
export function findRawGlbReferences(source) {
  const withoutComments = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  const references = []

  for (const line of withoutComments.split('\n')) {
    if (!line.includes('/assets/models/') || line.includes('getAssetUrl(')) {
      continue
    }

    const matches = line.match(
      /\/assets\/models\/[A-Za-z0-9_.$/{}/-]+\.glb/g
    ) ?? []
    references.push(...matches.map((reference) => reference.slice(1)))
  }

  return [...new Set(references)].sort()
}

/** 실행 코드에 공통 URL 헬퍼 없이 남아 있는 이미지·오디오·영상 경로를 찾는다. */
export function findRawRuntimeAssetReferences(source) {
  const withoutComments = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  const references = []

  for (const line of withoutComments.split('\n')) {
    if (!line.includes('/assets/') || line.includes('getAssetUrl(')) {
      continue
    }

    const matches = line.match(
      /\/assets\/[A-Za-z0-9_.$/{}/-]+\.[A-Za-z0-9]+/g
    ) ?? []
    references.push(...matches.map((reference) => reference.slice(1)))
  }

  return [...new Set(references)].sort()
}

/** 원본 목록의 객체 키와 중복 파일 충돌을 검사한다. */
export function validateAssetEntries(entries) {
  const entriesByObjectKey = new Map()

  for (const entry of entries) {
    validateObjectKey(entry.objectKey)

    const previous = entriesByObjectKey.get(entry.objectKey)
    if (previous && previous.sha256 !== entry.sha256) {
      throw new Error(
        `Asset conflict for ${entry.objectKey}: ` +
        `${previous.sourcePath} and ${entry.sourcePath}`
      )
    }

    entriesByObjectKey.set(entry.objectKey, entry)
  }

  return entries
}

/** 실행 소스에서 주석과 테스트 fixture를 제외한 정적 에셋 참조를 찾는다. */
export function extractAssetReferences(source, filePath) {
  if (/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(filePath)) {
    return []
  }

  const withoutComments = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  const matches = withoutComments.match(
    /(?:\.\/|\/)?assets\/[A-Za-z0-9_./-]+/g
  ) ?? []

  return [...new Set(
    matches
      .map((reference) => reference.replace(/^(?:\.\/|\/)/, ''))
      .filter((reference) => !reference.endsWith('/'))
  )].sort()
}

/** 실행 참조가 필수 에셋 목록에 모두 포함되었는지 검사한다. */
export function validateReferencedAssets(references, entries) {
  const documentedObjectKeys = new Set(
    entries.map((entry) => entry.objectKey)
  )
  const missingReferences = references.filter(
    (reference) => !documentedObjectKeys.has(reference)
  )

  if (missingReferences.length > 0) {
    throw new Error(
      `Missing required asset entries: ${missingReferences.join(', ')}`
    )
  }

  return references
}
