export interface MatcherPayload {
  uuid?: string
  queue?: string
  content?: string
}

export interface MatcherMessage {
  type: "add" | "remove" | "message"
  payload: MatcherPayload
}
