export enum CHANNEL {
  MATCHER = "matcher",
  RETURNER = "returner",
  EXECUTOR = "executor",
  STANDARLIZER = "standarlizer",
}

export interface StandardPayload {
  uuid: string
  platform: string
  content?: string
  queue?: string
}
