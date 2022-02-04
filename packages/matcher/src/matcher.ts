import Redis from "ioredis"
import * as amqblib from "amqplib"
import { pipe } from "@webare/utils"
import { CHANNEL } from "@webare/common"
import { findOrAddToQueue, removeFromQueue } from "resources"
import { QueueManager, TunnelManager } from "managers"
import { safeParse, verifyMessage } from "utils"
import { MatcherMessage } from "types"
import Config from "config"

export let redis: Redis.Redis
export let connection: amqblib.Connection
export let channel: amqblib.Channel

// Managers
export let queueManager: QueueManager
export let tunnelManager: TunnelManager

const initilaize = async () => {
  // Initializer Services
  redis = new Redis(Config.REDIS_URL)
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
      const content: MatcherMessage | undefined = await parseAndVerify(
        msg.content.toString()
      )
      if (content === undefined) return channel.nack(msg, false, false)
      switch (content.type) {
        case "add": {
          const result = await findOrAddToQueue(content.payload)
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
