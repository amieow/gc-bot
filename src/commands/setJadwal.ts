import { CONFIG } from "../config";
import bot, { commands } from "../app/bot";
import { handleCommand } from "../app/helpers";
import { dbuser } from "../app/mongodb";

export const description =
	"mengganti jadwal untuk hari tertentu senin,selasa,rabu,kamis,jumat";
export const usage = "set.jadwal <hari>";
export const example = `${CONFIG.prefix}set.jadwal senin`;
// export const example = "";
export default handleCommand(async (chat, msg, from) => {
	if (from.role == "sekretaris") {
		if (!/senin|selasa|rabu|kamis|jumat/.test(chat)) {
			await msg.reply("Wrong format,contoh : " + example);
			return;
		}
		dbuser[from.contact].catchReply = "!set-jadwal " + chat;
		await msg.reply(
			`*listening*\nreply saya untuk jadwal baru di hari ${chat}`,
		);
		return;
	}
	await msg.reply("anda bukan sekretaris");
});
