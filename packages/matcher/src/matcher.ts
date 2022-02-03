import Redis from "ioredis"
import * as amqblib from "amqplib"
import { CHANNEL } from "@webare/common"
import { QueueManager, TunnelManager } from "managers"
import { safeParse, verifyMessage } from "utils"
import { MatcherMessage } from "types"
import { pipe } from "@webare/utils"
import Config from "config"
import { addToQueue, removeFromQueue } from "resources"

export let redis: Redis.Redis
export let connection: amqblib.Connection
export let channel: amqblib.Channel

// Managers
export let queueManager: QueueManager
export let tunnelManager: TunnelManager

const initilaize = async () => {
  // Initializer Services
  redis = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
  })
  connection = await amqblib.connect(Config.AMQB_URL)
  channel = await connection.createChannel()
  // Initialize Managers
  queueManager = new QueueManager()
  tunnelManager = new TunnelManager()
}

export default async function matcher() {
  await initilaize()

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
        case "add": {
          const result = await addToQueue(content.payload)
          if (!result) return channel.nack(msg, false, false)
          break
        }
        case "message": {
          const tunnel = await tunnelManager.get(content.payload.uuid!)
          if (!tunnel) return "TODO: Send error back to author here"
          return "TODO: Send message content to receiver here"
        }
        case "remove:queue": {
          const result = await removeFromQueue(content.payload)
          if (!result) return channel.nack(msg, false, false)
          break
        }
        case "remove:tunnel":
          break
      }

      channel.ack(msg)
    } catch (e) {
      channel.nack(msg, false, true)
    }
  })
}

export * from "./types"
