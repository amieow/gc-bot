import bot from "../app/bot";
import { handleCommand } from "../app/helpers";
import { CONFIG } from "../config";
import PR from "../models/pr";

export const description = "Menghapus PR";
export const usage = "pr- <id>";
export const example = `*${CONFIG.prefix}pr- 5*`;
export default handleCommand(async (chat, msg, from) => {
	if (CONFIG.sekretaris.includes(from.contact)) {
		if (!chat) {
			await msg.reply(`Wrong Format: ${example}`);
			return;
		}
		const [id] = chat.split(" ");
		if (isNaN(Number(id))) {
			await msg.reply("ID harus angka");
			return;
		}
		try {
			const res = await PR.findOneAndDelete({ id: Number(id) });
			if (res) {
				await msg.reply(`PR dengan Id : ${id} sudah di hapus`);
			} else {
				await msg.reply(`PR dengan Id : ${id} tidak ditemukan`);
			}
		} catch (error) {
			console.error("Error deleting item:", (error as Error).message);
			await msg.reply("ada yang salah :/");
		}
	} else {
		await msg.reply("Anda bukan sekretaris");
		return;
	}
});
