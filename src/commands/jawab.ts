import { formatSerializedNumberToMention, handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { addPoinToClient } from "./tebak";

export const usage = "jawab <kata>";
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	if (!chat) {
		await msg.reply("Kamu harus menyebutkan kata yang ingin dijawab");
		return;
	}
	chat = chat.toLowerCase();
	if (from.group) {
		if (!dbgroup[from.group].ansGambar) return;
		const jawab = dbgroup[from.group].ansGambar;
		if (!jawab) return;
		if (chat == jawab) {
			dbgroup[from.group].anskata = undefined;
			await addPoinToClient(from, 10);
			await msg.reply(
				`*jawaban benar*\n+10 poin ${formatSerializedNumberToMention(
					from.contact,
				)}`,
				undefined,
				{
					mentions: [from.contact],
				},
			);
		} else {
			await msg.react("🟥");
		}
	} else {
		if (!dbuser[from.contact].ansGambar) return;
		const jawab = dbuser[from.contact].ansGambar;
		if (!jawab) return;
		if (chat == jawab) {
			dbuser[from.contact].anskata = undefined;
			await addPoinToClient(from, 10);
			await msg.reply(
				`*jawaban benar*\n+10 poin ${formatSerializedNumberToMention(
					from.contact,
				)}`,
				undefined,
				{
					mentions: [from.contact],
				},
			);
		} else {
			await msg.react("🟥");
		}
	}
});
