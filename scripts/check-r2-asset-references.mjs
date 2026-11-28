import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { findUnmanagedAssetReferences } from './lib/r2Assets.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '..')
const sourceRoot = path.join(repositoryRoot, 'src')
const supportedExtensions = new Set(['.css', '.js', '.jsx'])

/** 검사할 실행 소스 파일을 하위 폴더까지 모은다. */
async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(entryPath))
    } else if (supportedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

/** 실행 파일에 공통 R2 주소 장치를 우회한 에셋 경로가 없는지 검사한다. */
async function checkAssetReferences() {
  const sourceFiles = await collectSourceFiles(sourceRoot)
  const files = [
    ...sourceFiles,
    path.join(repositoryRoot, 'index.html'),
  ]
  const violations = []

  for (const filePath of files) {
    const relativePath = path.relative(repositoryRoot, filePath)
    const source = await readFile(filePath, 'utf8')

    for (const reference of findUnmanagedAssetReferences(source, relativePath)) {
      violations.push(`${relativePath}: ${reference}`)
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `Unmanaged runtime asset references:\n${violations.join('\n')}`
    )
  }

  console.log('All runtime asset references use the shared R2 URL mechanisms.')
}

await checkAssetReferences()
