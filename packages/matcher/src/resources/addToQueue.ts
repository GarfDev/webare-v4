import { queueManager } from "matcher"
import { MatcherMessage } from "types"

export const addToQueue = async (payload: MatcherMessage["payload"]) => {
  const result = await queueManager.add(payload.queue!, payload.uuid!)
  return result
}
