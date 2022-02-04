import { CHANNEL } from "@webare/common"
import { ReturnerMessage } from "@webare/returner"
import { channel, queueManager } from "matcher"
import { MatcherMessage } from "types"
import { matchUser } from "./matchUser"

export const addToQueue = async (payload: MatcherMessage["payload"]) => {
  try {
    await queueManager.add(payload.queue!, payload.uuid!, payload.platform)
    const message: ReturnerMessage = {
      type: "system",
      payload: {
        ...payload,
        content: "added_to_queue.success",
      },
    }
    channel.sendToQueue(CHANNEL.RETURNER, Buffer.from(JSON.stringify(message)))
    return true
  } catch {
    return false
  }
}
