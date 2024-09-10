import { CONFIG } from "../config";
import { handleCommand } from "../app/helpers";
import PR from "../models/pr";

export const description = "menu kelas";
export const usage = "pr+ <description>";
export const example = `${CONFIG.prefix}pr+ matematika hal 69`;
export default handleCommand(async (chat, msg, from) => {
	if (CONFIG.sekretaris.includes(from.contact)) {
		if (!chat) {
			await msg.reply(`Wrong Format: ${usage}`);
			return;
		}
		try {
			const newPR = await PR.create({ description: chat });
			await msg.reply(`PR berhasil dibuat. ID: ${newPR.id}`);
		} catch (error) {
			if (error instanceof Error) {
				await msg.reply("Error : " + error.message);
			} else {
				await msg.reply("An unknown error occurred");
				console.log(error);
			}
		}
	} else {
		await msg.reply("Anda bukan sekretaris");
		return;
	}
});
