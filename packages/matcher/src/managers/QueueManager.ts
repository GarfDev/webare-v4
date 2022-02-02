import { redis } from "matcher"

export class QueueManager {
  public async add(queue: string, uuid: string) {
    const result = await redis.hset(queue, uuid)
    return !!result
  }
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
