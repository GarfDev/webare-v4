import { initTimers } from "timers/index"
import initialWorker from "worker"
import matcher, { initilaize } from "./matcher"

;(async () => {
  await initilaize()
  await initTimers()
  await matcher()
  await initialWorker()
})()
