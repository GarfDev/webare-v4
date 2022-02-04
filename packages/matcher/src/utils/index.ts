export * from "./verify"

export const safeParse = (msg: string) => {
  try {
    return JSON.parse(msg)
  } catch {
    return {}
  }
}

export const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length)
}
