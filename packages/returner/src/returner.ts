import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import Config from "config"

export default async function returner() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()
  await channel.assertQueue(CHANNEL.MATCHER)

  const arr = new Array(40).fill(undefined)

  arr.forEach((_, i) => {
    console.log(`Adding user ${i + 1}`)
    channel.sendToQueue(
      CHANNEL.MATCHER,
      Buffer.from(
        JSON.stringify({
          type: "add",
          payload: {
            uuid: i + 1,
            platform: "discord",
            queue: "general",
          },
        })
      )
    )
  })

  console.log("Hello from Returner")
}

export * from "./types"
