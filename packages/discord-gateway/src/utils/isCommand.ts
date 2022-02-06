import { commandManager } from "gateway";
import { getPrefix } from "./getPrefix";

export const checkIsCommand = (msg: string): string | false => {
  const prefix = getPrefix();
  const content = msg.toLowerCase().trim();
  if (!content.startsWith(prefix)) return false;

  /* A command can be like `!ping param1, param2`, and this is to get the `ping` part */
  const command = content.replace(prefix, "").split(" ")[0];

  if (commandManager.check(command)) {
    return command;
  }

  return false;
};