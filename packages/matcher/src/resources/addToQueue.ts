import { CHANNEL } from "@webare/common"
import { ReturnerMessage } from "@webare/returner"
import { channel, queueManager, tunnelManager } from "matcher"
import { matcherJobQueue } from "timers/matcher"
import { MatcherMessage } from "types"

export const addToQueue = async (payload: MatcherMessage["payload"]) => {
  try {
    let message: ReturnerMessage = {
      type: "system",
      payload: {
        ...payload,
        content: "add_queue.success",
      },
    }

    const tunnel = await tunnelManager.get(payload.uuid!)
    if (tunnel) {
      message.payload.content = "add_queue.already_matched"
      channel.sendToQueue(
        CHANNEL.RETURNER,
        Buffer.from(JSON.stringify(message))
      )
      return false
    }
    await queueManager.add(payload.queue!, payload.uuid!, payload.platform)
    await matcherJobQueue.add("find", { queue: payload.queue! })
    channel.sendToQueue(CHANNEL.RETURNER, Buffer.from(JSON.stringify(message)))
    return true
  } catch {
    return false
  }
}
