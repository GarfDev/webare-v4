import * as fs from "fs"
import { REST } from "@discordjs/rest"
import { SlashCommandBuilder } from "@discordjs/builders"
import { Routes } from "discord-api-types/v9"
import Config from "config"
import { staticPath } from "utils"
import { Command } from "types"

const commandPath = staticPath("commands")
const commandFiles: any[] = []

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
    console.log("Started refreshing application (/) commands.")
    await rest.put(Routes.applicationCommands(clientId || ""), {
      body: slashCommands,
    })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
}
