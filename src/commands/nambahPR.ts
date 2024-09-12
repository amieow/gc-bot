import { CONFIG } from "../config";
import { generateID, handleCommand, loading } from "../app/helpers";
import PR from "../models/pr";

export const description = "menu kelas";
export const usage = "pr+ <description>";
export const example = `${CONFIG.prefix}pr+ matematika hal 69`;
export default handleCommand(async (chat, msg, from) => {
	if (from.role && from.role == "sekretaris") {
		if (!chat) {
			await msg.reply(`Wrong Format: ${usage}`);
			return;
		}
		await loading(msg, async () => {
			const newId = generateID(4);
			await PR.updateOne(
				{ remote: from.group }, // Filter by the remote field
				{
					$push: {
						pr: {
							description: chat,
							id: newId,
						},
					},
				}, // Push the new PR item into the array
			);
		});
	} else {
		await msg.reply("Anda bukan sekretaris");
		return;
	}
});
