import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import Config from "config"

export default async function returner() {
  const connection = await amqblib.connect(Config.AMQB_URL)
  const channel = await connection.createChannel()
  await channel.assertQueue(CHANNEL.MATCHER)
  channel.sendToQueue(CHANNEL.MATCHER, Buffer.from("Hello"))
  console.log("Hello from Returner")
}
