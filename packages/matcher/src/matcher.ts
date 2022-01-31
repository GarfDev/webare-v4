import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import { verifyMessage } from "utils"
import Config from "config"

export default async function matcher() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()

  channel.consume(CHANNEL.MATCHER, async (msg) => {
    if (!msg) return
    try {
      console.log(msg.content.toString())
      const content = verifyMessage(JSON.parse(msg.content.toString()))
      channel.ack(msg)
    } catch (e) {
      channel.nack(msg, false, false)
    }
  })
}

export * from "./types"
