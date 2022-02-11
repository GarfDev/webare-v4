import * as amqblib from "amqplib"
import { Client, Intents, Interaction } from "discord.js"
import { CHANNEL, GatewayMessage } from "@webare/common"
import { pipe, safeParse } from "@webare/utils"
import { CommandManager } from "managers"
import { commands, slashRegister } from "slash"
import { checkIsCommand } from "utils"
import Config from "config"
import { verifyMessage } from "utils/verify"
import { logger } from "common"

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
    logger.info(`Logged in as **${client.user?.tag}**!`, "INIT")
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

  channel.assertQueue(`discord:outbound`)

  channel.consume(`discord:outbound`, async (msg) => {
    if (!msg) return
    try {
      const parseAndVerify = pipe(safeParse, verifyMessage)
      const content: GatewayMessage | undefined = await parseAndVerify(
        msg.content.toString()
      )
      console.log("content", content)
      if (content === undefined) return channel.nack(msg, false, false)

      // Forward message to receiver
      try {
        const channel = await client.users.fetch(content.payload.uuid!)
        channel.send(content.payload.content!)
      } catch (e) {}
    } catch {}
  })

  // TODO
  client.login(Config.TOKEN)
}

export default gateway
