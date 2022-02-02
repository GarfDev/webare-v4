import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import { safeParse, verifyMessage } from "utils"
import Config from "config"
import { pipe } from "@webare/utils"
import { MatcherMessage } from "./types"
import { QueueManager, TunnelManage } from "managers"

export default async function matcher() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()

  const queueManager = new QueueManager()
  const tunnelManager = new TunnelManage()

  channel.consume(CHANNEL.MATCHER, async (msg) => {
    // Pre-process messages
    if (!msg) return
    try {
      const parseAndVerify = pipe(safeParse, verifyMessage)
      const content: MatcherMessage | undefined = parseAndVerify(
        msg.content.toString()
      )
      if (!content) return channel.nack(msg, false, false)

      switch (content.type) {
        case "add":
          const result = queueManager.add(
            content.payload.queue!,
            content.payload.uuid!
          )
          if (!result) {
            return channel.nack(msg, false, false)
          }
          break
        case "message":
          const tunnel = tunnelManager.get(content.payload.uuid!)
          if (!tunnel) return "TODO: Send error back to author here"
          return "TODO: Send message content to receiver here"
        case "remove":
          break
      }

      channel.ack(msg)
    } catch (e) {
      channel.nack(msg, false, true)
    }
  })
}

export * from "./types"
