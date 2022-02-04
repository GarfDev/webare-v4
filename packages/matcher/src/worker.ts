import { Job, Worker } from "bullmq"
import { JOB_QUEUES } from "common"
import { redis } from "matcher"
import { processMatchQueue } from "timers/matcher"

const initialWorker = async () => {
  const _ = new Worker(
    JOB_QUEUES.MATCHER_JOB_QUEUE,
    async (job: Job) => {
      await processMatchQueue(job.data.queue)
    },
    { connection: redis }
  )
}

export default initialWorker
