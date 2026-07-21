const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicAssetPath(assetPath: string) {
  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;

  return `${publicBasePath}${normalizedPath}`;
}
