import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import Config from "config"

export default async function returner() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()
  await channel.assertQueue(CHANNEL.MATCHER)
  channel.sendToQueue(
    CHANNEL.MATCHER,
    Buffer.from(
      JSON.stringify({
        type: "add",
        payload: {
          uuid: 3,
          platform: "discord",
          queue: "general",
        },
      })
    )
  )
  console.log("Hello from Returner")
}

export * from "./types"
