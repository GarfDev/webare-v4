export * from "./verify"

export const safeParse = (msg: string) => {
  try {
    return JSON.parse(msg)
  } catch {
    return {}
  }
}
