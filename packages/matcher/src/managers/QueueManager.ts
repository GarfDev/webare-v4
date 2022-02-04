import { redis } from "matcher"
import { getRandomIndex } from "utils"

export class QueueManager {
  //
  public async get(queue: string, uuid: string) {
    return await redis.hget(queue, uuid)
  }
  //
  public async getAll(queue: string) {
    return await redis.hkeys(queue)
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
}

interface Queue {
  [uuid: string]: string
}

interface QueueMap {
  [queueName: string]: Queue
}
