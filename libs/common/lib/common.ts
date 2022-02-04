export enum CHANNEL {
  MATCHER = "matcher",
  EXECUTOR = "executor",
  STANDARLIZER = "standarlizer",
}

export type Platform = "discord" | "messenger"

export interface StandardPayload {
  uuid: string
  platform: Platform
  content?: string
  queue?: string
}

export interface GatewayPayload extends StandardPayload {}

export interface GatewayMessage {
  type: "system" | "message"
  payload: GatewayPayload
}
