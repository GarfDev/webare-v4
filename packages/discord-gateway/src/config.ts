import dotenv from "dotenv"

dotenv.config()

export default {
  TOKEN: process.env.TOKEN || "",
  DEFAULT_PREFIX: process.env.DEFAULT_PREFIX || "",
}
