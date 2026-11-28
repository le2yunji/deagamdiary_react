import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateRemoteAssetResponse } from "./lib/r2Assets.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const inventoryPath = path.join(
  repositoryRoot,
  "docs/assets/r2-asset-inventory.json",
);
const defaultOrigins = [
  "http://localhost:5173",
  "https://iamtalkingpotato.vercel.app",
];

/** 이름만 보여 주고 비밀값을 출력하지 않은 채 필수 환경변수를 검사한다. */
function requireEnvironmentVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** 공개 R2 객체 전체의 상태·크기·형식·허용 origin을 HEAD 요청으로 확인한다. */
async function verifyAssets() {
  const publicBaseUrl = requireEnvironmentVariable(
    "R2_PUBLIC_BASE_URL",
  ).replace(/\/+$/, "");
  const origins = process.env.R2_VERIFY_ORIGINS
    ? process.env.R2_VERIFY_ORIGINS.split(",").map((origin) =>
        origin.trim(),
      )
    : defaultOrigins;
  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const requiredAssets = inventory.assets.filter(
    (asset) => asset.status === "required",
  );

  for (const [index, asset] of requiredAssets.entries()) {
    const assetUrl = `${publicBaseUrl}/${asset.objectKey}`;

    for (const origin of origins) {
      const response = await fetch(assetUrl, {
        method: "HEAD",
        headers: { Origin: origin },
      });
      validateRemoteAssetResponse(asset, response, origin);
    }

    console.log(
      `[${index + 1}/${requiredAssets.length}] verified ${asset.objectKey}`,
    );
  }
}

await verifyAssets();
