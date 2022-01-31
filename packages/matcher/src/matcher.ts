import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import { safeParse, verifyMessage } from "utils"
import Config from "config"
import { pipe } from "@webare/utils"
import { MatcherMessage } from "./types"

export default async function matcher() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()

  channel.consume(CHANNEL.MATCHER, async (msg) => {
    if (!msg) return
    try {
      const content: MatcherMessage | undefined = pipe(
        safeParse,
        verifyMessage
      )(msg.content.toString())
      if (!content) return channel.nack(msg, false, false)
      channel.ack(msg)
    } catch (e) {
      channel.nack(msg, false, true)
    }
  })
}

export * from "./types"
