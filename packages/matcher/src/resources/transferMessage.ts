import { CHANNEL, GatewayMessage } from "@webare/common"
import { channel, platformManager, tunnelManager } from "matcher"
import { MatcherPayload } from "types"

export const transferMessage = async (
  payload: MatcherPayload
): Promise<boolean> => {
  try {
    let message: GatewayMessage = {
      type: "system",
      payload: {
        ...payload,
      },
    }
    const receiver = await tunnelManager.get(payload.uuid)

    if (!receiver) {
      message.payload.content = "not_matched"
      channel.sendToQueue(
        `${message.payload.platform}:${CHANNEL.OUTBOUND}`,
        Buffer.from(JSON.stringify(message))
      )
      return false
    }

    const rPlatform = await platformManager.get(receiver)

    message.type = "message"
    message.payload.platform = rPlatform!
    message.payload.uuid = receiver

    channel.sendToQueue(
      `${message.payload.platform}:${CHANNEL.OUTBOUND}`,
      Buffer.from(JSON.stringify(message))
    )

    return true
  } catch {
    return false
  }
}
