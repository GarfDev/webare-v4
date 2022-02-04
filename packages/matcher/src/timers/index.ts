import { initMatchJobQueue } from "./matcher"

export const initTimers = async () => {
  await initMatchJobQueue()
}
