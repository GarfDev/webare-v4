import { CHANNEL } from "@webare/common"
import { channel } from "gateway"
import { Command } from "types"

const command: Command = {
  name: "find",
  alias: ["find", "f"],
  description: "Join to match queue to match with a random user",
  execute: async ({ message, interaction }) => {
    const uuid = message?.author?.id || interaction?.user?.id
    if (!uuid) return
    channel.sendToQueue(
      CHANNEL.MATCHER,
      Buffer.from(
        JSON.stringify({
          type: "add",
          payload: {
            uuid,
            platform: "discord",
            queue: "general",
          },
        })
      )
    )
  },
}

export default command
