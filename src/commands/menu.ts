import { CONFIG } from "../config";
import bot, { commands } from "../app/bot";
import { handleCommand } from "../app/helpers";

export const description = "menu kelas";
export const usage = "menu";
// export const example = "";
export default handleCommand(async (chat, msg) => {
	let commandlist = "";
	for (const map in commands) {
		commandlist += `${CONFIG.prefix}${commands[map].usage} : ${commands[map].description}\n`;
	}
	await msg.reply(`------ *MENU GERCEPBOT* -------
${commandlist}`);
});
