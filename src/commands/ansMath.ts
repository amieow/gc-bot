import { formatSerializedNumberToMention, handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { addPoinToClient } from "./tebak";

export const usage = "ans <jawaban>";
export const description = "jawab soal yang telah diberikan";
export const example = `ans 10`;
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	let jawaban: { ans: string; poin: number } | undefined;
	if (from.group) {
		jawaban = dbgroup[from.group].ansmath;
	} else {
		jawaban = dbuser[from.contact].ansmath;
	}
	if (!jawaban) {
		await msg.reply("Invalid");
		return;
	}
	if (jawaban.ans == chat) {
		if (from.group) dbgroup[from.group].ansmath = undefined;
		else dbuser[from.contact].ansmath = undefined;
		await addPoinToClient(from, jawaban.poin);
		await msg.reply(
			`*Jawaban Benar*\n+${jawaban.poin} ${formatSerializedNumberToMention(
				from.contact,
			)}`,
			undefined,
			{
				mentions: [from.contact],
			},
		);
	}
});
