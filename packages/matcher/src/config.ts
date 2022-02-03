import { config } from "dotenv"

config()

const Config = {
  AMQB_URL: process.env.AMQB_URL || "",
  REDIS_URL: process.env.REDIS_URL || "",
}

export default Config
