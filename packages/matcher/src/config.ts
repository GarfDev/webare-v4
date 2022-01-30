import { config } from "dotenv";

config();

const Config = {
    AMQB_URL: process.env.AMQB_URL || "",
};

export default Config;
