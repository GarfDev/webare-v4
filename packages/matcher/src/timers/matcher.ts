import { Queue, QueueScheduler, Job } from "bullmq"
import { JOB_QUEUES } from "common"
import { queueManager, redis, tunnelManager } from "matcher"
import { getRandomIndex, mathFloor } from "utils"

export let matcherJobQueue: Queue<any, any, string>
export let matcherScheduler: QueueScheduler

export const initMatchJobQueue = async () => {
  matcherJobQueue = new Queue(JOB_QUEUES.MATCHER_JOB_QUEUE, {
    connection: redis,
    defaultJobOptions: {
      removeOnFail: true,
      removeOnComplete: true,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    },
  })

  matcherScheduler = new QueueScheduler(JOB_QUEUES.MATCHER_JOB_QUEUE, {
    connection: redis,
  })
}

export const processMatchQueue = async (queue: string) => {
  const queueSnapshot = await queueManager.getAll(queue)
  const estimated = mathFloor(queueSnapshot.length, 2)

  for (let i = 0; i < estimated; i++) {
    const firstMatchIndex = getRandomIndex(queueSnapshot.length)
    const firstMatch = queueSnapshot[firstMatchIndex]
    queueSnapshot.splice(firstMatchIndex, 1)

    const secMatchIndex = getRandomIndex(queueSnapshot.length)
    const secMatch = queueSnapshot[secMatchIndex]
    queueSnapshot.splice(secMatchIndex, 1)
    await queueManager.remove(queue, firstMatch)
    await queueManager.remove(queue, secMatch)
    await tunnelManager.add(firstMatch, secMatch)
  }
}
