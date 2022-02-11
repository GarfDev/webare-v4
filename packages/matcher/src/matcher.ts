import Redis from "ioredis"
import * as amqblib from "amqplib"
import { pipe, safeParse } from "@webare/utils"
import { CHANNEL } from "@webare/common"
import { addToQueue, removeFromQueue, transferMessage } from "resources"
import { QueueManager, TunnelManager, PlatformManager } from "managers"
import { verifyMessage } from "utils"
import { MatcherMessage } from "types"
import Config from "config"

export let redis: Redis.Redis
export let connection: amqblib.Connection
export let channel: amqblib.Channel

// Managers
export let queueManager: QueueManager
export let tunnelManager: TunnelManager
export let platformManager: PlatformManager

export const initilaize = async () => {
  // Initializer Services
  redis = new Redis(Config.REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  })

  redis.on("connect", () => {
    console.info(`connected to redis server.`)
  })

  connection = await amqblib.connect(Config.AMQB_URL)
  channel = await connection.createChannel()

  // Initialize Managers
  queueManager = new QueueManager()
  tunnelManager = new TunnelManager()
  platformManager = new PlatformManager()
}

export default async function matcher() {
  await channel.assertQueue(CHANNEL.MATCHER);
  channel.consume(CHANNEL.MATCHER, async (msg) => {
    // Pre-process messages
    if (!msg) return
    try {
      const parseAndVerify = pipe(safeParse, verifyMessage)
      const content: MatcherMessage | undefined = await parseAndVerify(
        msg.content.toString()
      )
      if (content === undefined) return channel.nack(msg, false, false)
      await platformManager.set(content.payload.uuid!, content.payload.platform)

      switch (content.type) {
        case "add": {
          const result = await addToQueue(content.payload)
          if (!result) return channel.nack(msg, false, false)
          break
        }
        case "message": {
          const result = await transferMessage(content.payload)
          if (!result) return channel.nack(msg, false, false)
          break
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
