import { queueManager, tunnelManager } from "matcher"

export const matchUser = async (
  queue: string,
  uuid: string
): Promise<[string, string] | undefined> => {
  const candidate = await queueManager.getRandom(queue, uuid)
  if (!candidate) return undefined
  // Create a tunnel to transport further messages
  await tunnelManager.add(uuid, candidate)
  return [uuid, candidate]
}
