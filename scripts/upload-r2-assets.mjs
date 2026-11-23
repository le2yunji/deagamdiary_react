import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildAwsUploadArgs,
  validateAssetBuffer,
} from './lib/r2Assets.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '..')
const inventoryPath = path.join(
  repositoryRoot,
  'docs/assets/r2-asset-inventory.json'
)

/** 이름만 보여 주고 비밀값을 출력하지 않은 채 필수 환경변수를 검사한다. */
function requireEnvironmentVariable(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/** 인벤토리와 일치하는 필수 파일만 지정된 R2 버킷에 순서대로 올린다. */
async function uploadAssets() {
  const sourceRoot = path.resolve(
    requireEnvironmentVariable('R2_ASSET_SOURCE_ROOT')
  )
  const endpointUrl = requireEnvironmentVariable('R2_ENDPOINT_URL')
  const bucket = process.env.R2_BUCKET_NAME || 'i-am-talking-potato'

  requireEnvironmentVariable('AWS_ACCESS_KEY_ID')
  requireEnvironmentVariable('AWS_SECRET_ACCESS_KEY')

  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
  const requiredAssets = inventory.assets.filter(
    (asset) => asset.status === 'required'
  )

  for (const [index, asset] of requiredAssets.entries()) {
    const sourcePath = path.join(sourceRoot, asset.sourcePath)
    const fileBuffer = await readFile(sourcePath)
    validateAssetBuffer(asset, fileBuffer)

    const result = spawnSync(
      'aws',
      buildAwsUploadArgs(asset, { bucket, endpointUrl, sourceRoot }),
      { env: process.env, stdio: 'inherit' }
    )

    if (result.status !== 0) {
      throw new Error(`R2 upload failed: ${asset.objectKey}`)
    }

    console.log(
      `[${index + 1}/${requiredAssets.length}] uploaded ${asset.objectKey}`
    )
  }
}

await uploadAssets()
