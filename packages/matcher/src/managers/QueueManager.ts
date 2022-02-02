export class QueueManager {
  queues: QueueMap

  constructor() {
    this.queues = {}
  }

  public add(queue: string, uuid: string) {
    if (!this.queues[queue]) return false
    this.queues[queue][uuid] = uuid
    return true
  }
  public remove(queue: string, uuid: string) {
    delete this.queues[queue][uuid]
    return true
  }
}

interface Queue {
  [uuid: string]: string
}

interface QueueMap {
  [queueName: string]: Queue
}
