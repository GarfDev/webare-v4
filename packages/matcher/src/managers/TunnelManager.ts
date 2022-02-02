export class TunnelManage {
  tunnels: TunnelMap

  constructor() {
    this.tunnels = {}
  }

  public get(author: string) {
    return this.tunnels[author]
  }

  public add(author: string, receiver: string) {
    delete this.tunnels[author]
    delete this.tunnels[receiver]
    this.tunnels[author] = receiver
    this.tunnels[receiver] = author
  }

  public remove(author: string) {
    const receiver = this.tunnels[author]
    delete this.tunnels[author]
    delete this.tunnels[receiver]
  }
}

export interface TunnelMap {
  [authorId: string]: string
}
