import { StandardPayload } from "@webare/common"

export interface MatcherPayload extends StandardPayload {}

export interface MatcherMessage {
  type: "add" | "remove:queue" | "remove:tunnel" | "message"
  payload: MatcherPayload
}
