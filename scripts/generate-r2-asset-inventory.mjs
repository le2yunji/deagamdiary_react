import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildAssetInventory,
  extractAssetReferences,
  validateAssetEntries,
  validateReferencedAssets,
} from "./lib/r2Assets.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.resolve(
  process.env.R2_ASSET_SOURCE_ROOT || repositoryRoot,
);
const configPath = path.join(repositoryRoot, "config/r2-assets.json");
const outputPath = path.join(
  repositoryRoot,
  "docs/assets/r2-asset-inventory.json",
);

/** 디렉터리 아래의 실행 소스 파일을 재귀적으로 모은다. */
async function collectSourceFiles(directory) {
  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of directoryEntries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "assets") {
        continue;
      }
      files.push(...(await collectSourceFiles(entryPath)));
      continue;
    }

    if (/\.(?:css|html|js|jsx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

/** 소스 파일별 에셋 참조를 객체 키 중심의 맵으로 바꾼다. */
async function collectReferences(config) {
  const sourceFiles = [
    ...(await collectSourceFiles(path.join(repositoryRoot, "src"))),
    path.join(repositoryRoot, "index.html"),
  ];
  const exclusions = new Set(config.referenceScanExclusions ?? []);
  const referencesByObjectKey = new Map();

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(repositoryRoot, sourceFile);
    if (exclusions.has(relativePath)) {
      continue;
    }

    const source = await readFile(sourceFile, "utf8");
    for (const objectKey of extractAssetReferences(source, relativePath)) {
      const references = referencesByObjectKey.get(objectKey) ?? [];
      references.push(relativePath);
      referencesByObjectKey.set(objectKey, references);
    }
  }

  for (const [relativePath, objectKeys] of Object.entries(
    config.referenceOverrides ?? {},
  )) {
    for (const objectKey of objectKeys) {
      const references = referencesByObjectKey.get(objectKey) ?? [];
      if (!references.includes(relativePath)) {
        references.push(relativePath);
      }
      referencesByObjectKey.set(objectKey, references);
    }
  }

  return referencesByObjectKey;
}

/** 원본 저장소에서 Git이 추적하는 파일 경로를 읽는다. */
function collectTrackedPaths() {
  const output = execFileSync("git", ["-C", sourceRoot, "ls-files", "-z"], {
    encoding: "utf8",
  });

  return new Set(output.split("\0").filter(Boolean));
}

/** 설정과 실제 파일을 대조해 재현 가능한 R2 인벤토리를 생성한다. */
async function generateInventory() {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const referencesByObjectKey = await collectReferences(config);
  const runtimeReferences = [...referencesByObjectKey.keys()].sort();

  validateAssetEntries(
    config.assets.filter((entry) => entry.status === "required"),
  );
  validateReferencedAssets(runtimeReferences, config.assets);

  const assets = await buildAssetInventory(config.assets, {
    sourceRoot,
    trackedPaths: collectTrackedPaths(),
    referencesByObjectKey,
  });
  const requiredAssets = assets.filter((asset) => asset.status === "required");
  const inventory = {
    version: config.version,
    generatedAt: new Date().toISOString(),
    sourceRoot: "<R2_ASSET_SOURCE_ROOT>",
    summary: {
      requiredFiles: requiredAssets.length,
      requiredBytes: requiredAssets.reduce(
        (total, asset) => total + asset.size,
        0,
      ),
      trackedRequiredFiles: requiredAssets.filter((asset) => asset.gitTracked)
        .length,
      excludedEntries: assets.length - requiredAssets.length,
    },
    assets,
  };

  await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);

  console.log(
    `Generated ${requiredAssets.length} required assets ` +
      `(${inventory.summary.requiredBytes} bytes)`,
  );
}

await generateInventory();
