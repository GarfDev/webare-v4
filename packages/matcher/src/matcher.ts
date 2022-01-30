import * as amqblib from "amqplib";
import { CHANNEL } from "@webare/common";
import Config from "config";

export default async function matcher() {
    const connection = await amqblib.connect(Config.AMQB_URL);
    const channel = await connection.createChannel();

    channel.consume(CHANNEL.MATCHER, (msg) => {
        if (!msg) return;
    });
}
