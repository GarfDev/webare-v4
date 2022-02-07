import * as dotenv from "dotenv"

dotenv.config()

export default {
  TOKEN: process.env.TOKEN || "",
  AMQB_URL: process.env.AMQB_URL || "",
  DEFAULT_PREFIX: process.env.DEFAULT_PREFIX || "",
}
