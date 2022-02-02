import { redis } from "matcher"

const TUNNEL_NAME = "TUNNEL"

export class TunnelManage {
  public async get(author: string) {
    const result = await redis.hget(TUNNEL_NAME, author)
    return result
  }

  public async add(author: string, receiver: string) {
    await redis.hset(TUNNEL_NAME, author, receiver)
    await redis.hset(TUNNEL_NAME, receiver, author)
    return true
  }

  public async remove(author: string) {
    const receiver = await redis.hget(TUNNEL_NAME, author)
    if (!receiver) return false
    await redis.hdel(TUNNEL_NAME, receiver)
    await redis.hdel(TUNNEL_NAME, author)
  }
}

export interface TunnelMap {
  [authorId: string]: string
}
