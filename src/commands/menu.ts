import { CONFIG } from "../config";
import bot, { commands } from "../app/bot";
import { handleCommand } from "../app/helpers";

export const description = "menu kelas";
export const usage = "menu";
// export const example = "";
export default handleCommand(async (chat, msg, from) => {
	let commandlist = "";
	for (const map in commands) {
		if (commands[map].tags?.includes("hidden")) continue;
		commandlist += `\n- *${CONFIG.prefix}${commands[map].usage}*`;
	}
	commandlist.trim();
	await bot.sendMessage(
		msg.id.remote,
		`------ MENU GERCEP BOT ------
${commandlist}`,
	);
});
