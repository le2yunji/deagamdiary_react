/**
 * 에셋의 상대 경로를 배포 환경의 외부 스토리지 기본 주소와 결합한다.
 * 기본 주소가 없으면 기존 Vercel 정적 에셋 경로를 유지해 안전하게 되돌릴 수 있다.
 */
export const getAssetUrl = (
  path,
  baseUrl = process.env.REACT_APP_ASSET_BASE_URL
) => {
  const normalizedPath = `/${path.replace(/^\/+/, '')}`

  if (!baseUrl) {
    return normalizedPath
  }

  return `${baseUrl.replace(/\/+$/, '')}${normalizedPath}`
}
