import { redis } from "matcher"
import { getRandomIndex } from "utils"

export class QueueManager {
  //
  public async get(queue: string, uuid: string) {
    return await redis.hget(queue, uuid)
  }
  //
  public async add(queue: string, uuid: string, platform: string) {
    const result = await redis.hset(queue, uuid, platform)
    return !!result
  }
  //
  public async remove(queue: string, uuid: string) {
    try {
      const result = await redis.hdel(queue, uuid)
      return !!result
    } catch {
      return false
    }
  }
  //
  public async getRandom(
    queue: string,
    cannotbe?: string
  ): Promise<string | undefined> {
    try {
      let returnUser = ""
      const result = await redis.hkeys(queue)
      if (result.length < 1) return undefined
      while (!returnUser) {
        const candidate = result[getRandomIndex(result.length)]
        if (candidate !== cannotbe) {
          returnUser = candidate
        }
      }
      await redis.hdel(queue, returnUser)
      return returnUser
    } catch {
      return undefined
    }
  }
}

interface Queue {
  [uuid: string]: string
}

interface QueueMap {
  [queueName: string]: Queue
}
