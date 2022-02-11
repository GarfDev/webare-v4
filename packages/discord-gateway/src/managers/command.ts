import { logger } from "common"
import { Client, Interaction, Message } from "discord.js"
import { Command, Response } from "types"

/**
 * Manage API methods for Application Commands
 */
export class CommandManager {
  client: Client
  commands: CommandStorage

  constructor(client: Client, commandArr: Command[]) {
    const commands: CommandStorage = commandArr.reduce((manager, command) => {
      command.alias.forEach((alias) => {
        if (manager[alias]) {
          logger.error(
            `Command *${command.name}* have the same alias to other command`,
            "INIT"
          )
          throw Error(
            `COMMAND NAMED ${command.name} HAVE THE SAME ALIAS WITH OTHER COMMAND`
          )
        }

        manager[alias] = command.execute
      })
      logger.info(`Command *${command.name}* loaded`, "INIT")
      return manager
    }, {} as CommandStorage)

    this.client = client
    this.commands = commands
  }

  public check(alias: string): boolean {
    return !!this.commands[alias]
  }

  public async execute(
    alias: string,
    message: Message | Interaction
  ): Promise<Response> {
    const executor = this.commands[alias]
    if (executor) {
      const response = await executor(message)
      return response
    }
  }
}

/**
 * Types
 */

export interface CommandStorage {
  [alias: string]: Command["execute"]
}
