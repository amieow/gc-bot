import bot from "../app/bot";
import { handleCommand } from "../app/helpers";

export const description = "play a game ";
export const usage = "play tebak kata";
// export const example = "";
export default handleCommand(async (chat, msg) => {
	await msg.reply("pong");
});
