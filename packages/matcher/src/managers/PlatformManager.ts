import { redis } from "matcher"

export const PLATFORM_NAME = "platform"

export class PlatformManager {
  public async set(uuid: string, platform: string) {
    if ((await this.get(uuid)) !== null) return false
    await redis.hset(PLATFORM_NAME, uuid, platform)
    return true
  }

  public async get(uuid: string) {
    return await redis.hget(PLATFORM_NAME, uuid)
  }
}
