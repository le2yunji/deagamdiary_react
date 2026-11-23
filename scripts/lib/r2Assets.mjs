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
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  const matches = withoutComments.match(
    /(?:\.\/|\/)?assets\/[A-Za-z0-9_./-]+/g
  ) ?? []

  return [...new Set(
    matches.map((reference) => reference.replace(/^(?:\.\/|\/)/, ''))
  )].sort()
}

/** 실행 참조가 필수 에셋 목록에 모두 포함되었는지 검사한다. */
export function validateReferencedAssets(references, entries) {
  const requiredObjectKeys = new Set(
    entries
      .filter((entry) => entry.status === 'required')
      .map((entry) => entry.objectKey)
  )
  const missingReferences = references.filter(
    (reference) => !requiredObjectKeys.has(reference)
  )

  if (missingReferences.length > 0) {
    throw new Error(
      `Missing required asset entries: ${missingReferences.join(', ')}`
    )
  }

  return references
}
