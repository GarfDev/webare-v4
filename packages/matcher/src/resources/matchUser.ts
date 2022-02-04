import { queueManager, tunnelManager } from "matcher"

export const matchUser = async (
  queue: string,
  uuid: string
): Promise<[[string, string], string] | undefined> => {
  const candidate = await queueManager.getRandom(queue, uuid)
  if (!candidate) return undefined
  // Get user location
  const candidatePlatform = await queueManager.get(queue, candidate)
  // Remove from queue
  await queueManager.remove(queue, uuid)
  await queueManager.remove(queue, candidate)
  // Create a tunnel to transport further messages
  await tunnelManager.add(uuid, candidate)
  return [[uuid, candidate], candidatePlatform!]
}
