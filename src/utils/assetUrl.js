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
