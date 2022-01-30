import * as amqblib from "amqplib";
import { Channel } from '@webare/common';
import Config from "config";

export default async function matcher() {
    const connection = await amqblib.connect(Config.AMQB_URL);
    const channel = await connection.createChannel();
}
