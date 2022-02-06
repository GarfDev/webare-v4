import path from "path"

export const staticPath = (continuePath: string): string =>
  path.join(path.dirname(require.main?.filename || ""), continuePath)
