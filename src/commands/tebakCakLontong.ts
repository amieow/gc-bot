import { formatSerializedNumberToMention, handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { addPoinToClient } from "./tebak";

export const usage = "tebak <kata>";
export const description = "untuk memulai tebak kata";

export default handleCommand(async (chat, msg, from) => {
	if (chat.length == 0) {
		await msg.reply("Tebakan ga boleh kosong");
		return;
	}
	chat = chat.toUpperCase();
	if (from.group) {
		const ans = dbgroup[from.group].anskatav2;
		if (ans) {
			if (chat == ans) {
				dbgroup[from.group].anskatav2 = undefined;
				await addPoinToClient(from, 10);
				await msg.reply(
					`*kata benar*\n+10 poin ${formatSerializedNumberToMention(
						from.contact,
					)}`,
				);
			} else {
				await msg.reply(`kata salah`);
			}
		}
		return;
	}
	const ans = dbuser[from.contact].anskatav2;
	if (ans) {
		if (chat == ans) {
			dbuser[from.contact].anskatav2 = undefined;
			await addPoinToClient(from, 10);
			await msg.reply(
				`*kata benar*\n+10 poin ${formatSerializedNumberToMention(
					from.contact,
				)}`,
			);
		} else {
			await msg.reply(`kata salah`);
		}
	}
});
