import bot from "../app/bot";
import { handleCommand, loading } from "../app/helpers";
import { dbsekretaris } from "../app/mongodb";
import { CONFIG } from "../config";
import PR from "../models/pr";

export const description = "Menghapus PR";
export const usage = "pr- <id>";
export const example = `*${CONFIG.prefix}pr- abcd*`;
export default handleCommand(async (chat, msg, from) => {
	if (from.role && from.role == "sekretaris") {
		if (!chat) {
			await msg.reply(`Wrong Format: ${example}`);
			return;
		}
		if (!from.group) {
			await msg.reply("Anda harus berada dalam group");
			return;
		}
		const [id] = chat.split(" ");
		await loading(msg, async () => {
			await PR.updateOne({ remote: from.group }, { $pull: { pr: { id } } });
		});
		await msg.reply(`PR dengan ID ${id} berhasil dihapus`);
	} else {
		await msg.reply("Anda bukan sekretaris");
		return;
	}
});
