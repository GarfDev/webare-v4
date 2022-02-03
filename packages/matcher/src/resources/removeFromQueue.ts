import { queueManager } from "matcher"
import { MatcherMessage } from "types"

export const removeFromQueue = async (payload: MatcherMessage["payload"]) => {
  const result = await queueManager.remove(payload.queue!, payload.uuid!)
  return result
}
