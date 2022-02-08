export * from "./verify"

export const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length)
}

export const mathFloor = (a: number, b: number) => (a - (a % b)) / b
