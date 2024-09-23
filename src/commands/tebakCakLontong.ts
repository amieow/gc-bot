import {
	delay,
	formatSerializedNumberToMention,
	handleCommand,
} from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { addPoinToClient } from "./tebak";
import tebakKata from "./tebakKata";
import tebakKataCakLontong from "./tebakKataCakLontong";

export const usage = "tebak <kata>";
export const description = "untuk memulai tebak kata";
export const tags = ["hidden"];
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
					undefined,
					{ mentions: [from.contact] },
				);
				if ((dbgroup[from.group].playestime as number) <= 5) {
					await delay(2000);
					tebakKataCakLontong(chat, msg, from);
				} else {
					dbgroup[from.group].playestime = 0;
				}
			} else {
				await msg.react("❌");
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
				undefined,
				{ mentions: [from.contact] },
			);
			if ((dbuser[from.contact].playestime as number) < 5) {
				tebakKata(chat, msg, from);
			} else {
				dbuser[from.contact].playestime = 0;
			}
		} else {
			await msg.react("❌");
		}
	}
});
