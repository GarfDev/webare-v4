import { CHANNEL } from "@webare/common"
import { ReturnerMessage } from "@webare/returner"
import { channel, queueManager } from "matcher"
import { MatcherMessage } from "types"
import { matchUser } from "./matchUser"

export const addToQueue = async (payload: MatcherMessage["payload"]) => {
  const result = await queueManager.add(
    payload.queue!,
    payload.uuid!,
    payload.platform
  )
  if (!result) {
    const message: ReturnerMessage = {
      type: "system",
      payload: {
        ...payload,
        content: "added_to_queue.failed",
      },
    }
    channel.sendToQueue(CHANNEL.RETURNER, Buffer.from(JSON.stringify(message)))
    return true
  }
  const message: ReturnerMessage = {
    type: "system",
    payload: {
      ...payload,
      content: "added_to_queue.success",
    },
  }

  channel.sendToQueue(CHANNEL.RETURNER, Buffer.from(JSON.stringify(message)))
  return result
}

export const findOrAddToQueue = async (payload: MatcherMessage["payload"]) => {
  try {
    const result = await matchUser(payload.queue!, payload.uuid!)
    if (!result) {
      return addToQueue(payload)
    }

    const [[_, receiver], receiverPlatform] = result

    channel.sendToQueue(
      CHANNEL.RETURNER,
      Buffer.from(
        JSON.stringify({
          type: "system",
          payload: {
            ...payload,
          },
        } as ReturnerMessage)
      )
    )

    channel.sendToQueue(
      CHANNEL.RETURNER,
      Buffer.from(
        JSON.stringify({
          type: "system",
          payload: {
            ...payload,
            uuid: receiver,
            platform: receiverPlatform,
          },
        } as ReturnerMessage)
      )
    )

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
