import { Interaction, Message } from "discord.js"
import { Response } from "./Response"

export interface Command {
  name: string
  description: string
  alias: string[]
  execute: (props: {
    message?: Message
    interaction?: Interaction
  }) => Promise<Response>
}
