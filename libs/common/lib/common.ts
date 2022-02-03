export enum CHANNEL {
  MATCHER = "matcher",
}

export interface StandardPayload {
  uuid: string
  platform: string
  content?: string
  queue?: string
}
