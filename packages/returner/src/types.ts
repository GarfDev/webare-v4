import { StandardPayload } from "@webare/common"

export interface ReturnerPayload extends StandardPayload {}

export interface ReturnerMessage {
  type: "system" | "message"
  payload: ReturnerPayload
}
