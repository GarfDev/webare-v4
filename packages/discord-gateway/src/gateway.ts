import * as amqblib from "amqplib"
import { Client, Intents, Interaction } from "discord.js"
import { CommandManager } from "managers"
import { commands, slashRegister } from "slash"
import { checkIsCommand } from "utils"
import { CHANNEL } from "@webare/common"
import Config from "config"

export let connection: amqblib.Connection
export let channel: amqblib.Channel

export let commandManager: CommandManager

async function init(client: Client) {
  connection = await amqblib.connect(Config.AMQB_URL)
  channel = await connection.createChannel()

  commandManager = new CommandManager(client, commands)
}

async function gateway() {
  const client = new Client({
    partials: ["MESSAGE", "CHANNEL"],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
    ],
  })

  await init(client)

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    slashRegister(client.user?.id || "")
  })

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return
    if (message.author.id === client?.user?.id) return
    const commandName = checkIsCommand(message.content)
    if (!commandName) {
      channel.sendToQueue(
        CHANNEL.MATCHER,
        Buffer.from(
          JSON.stringify({
            type: "message",
            payload: {
              uuid: message.author.id,
              platform: "discord",
              content: message.content,
            },
          })
        )
      )
      return
    }

    const response = await commandManager.execute(commandName, message)

    if (response) {
      await message.channel.send(response)
    }
  })

  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const response = await commandManager.execute(
      interaction.commandName,
      interaction
    )

    if (response) {
      await interaction.reply({ content: response })
    }
  })

  channel.assertQueue(`discord-${CHANNEL.OUTBOUND}`)
  channel.consume(`discord-${CHANNEL.OUTBOUND}`, async (msg) => {
    if (!msg) return

  })

  // TODO
  client.login(Config.TOKEN)
}

export default gateway
