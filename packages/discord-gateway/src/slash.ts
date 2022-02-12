import * as fs from "fs"
import { REST } from "@discordjs/rest"
import { SlashCommandBuilder } from "@discordjs/builders"
import { Routes } from "discord-api-types/v9"
import Config from "config"
import { staticPath } from "utils"
import { Command } from "types"
import { logger } from "common"

const commandPath = staticPath("commands")
const commandFiles = fs.readdirSync(commandPath);

export const commands: Command[] = commandFiles.map((filename) => {
  const file = require(staticPath(`commands/${filename}`)).default
  return file
})

const slashCommands = commands
  .filter((file) => !!file)
  .map((file) => {
    const data = new SlashCommandBuilder()
      .setName(file.name)
      .setDescription(file.description)
      .toJSON()
    return data
  })

export const slashRegister = async (clientId: string) => {
  const rest = new REST({ version: "9" }).setToken(Config.TOKEN || "")

  try {
    logger.info(`Started refreshing application (/) commands.`, "INIT")
    await rest.put(Routes.applicationCommands(clientId || ""), {
      body: slashCommands,
    })
    logger.info(`Successfully reloaded application (/) commands`, "INIT")
  } catch (error) {
    console.error(error)
  }
}
