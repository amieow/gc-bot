import { handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { addPoinToClient } from "./tebak";

export const usage = "ans <jawaban>";
export const description = "jawab soal yang telah diberikan";
export const example = `${CONFIG.prefix}ans 10`;
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	let jawaban: { ans: number; poin: number } | undefined;
	if (from.group) {
		jawaban = dbgroup[from.group].ansmath;
	} else {
		jawaban = dbuser[from.contact].ansmath;
	}
	if (!Number.isInteger(chat) || !jawaban) {
		await msg.reply("Invalid");
		return;
	}
	if (String(jawaban.ans) == chat) {
		if (from.group) dbgroup[from.group].ansmath = undefined;
		else dbuser[from.contact].ansmath = undefined;
		await addPoinToClient(from, jawaban.poin);
		await msg.reply(
			`*Tebakan Benar*\n+${jawaban.poin} ${dbuser[from.contact].name}`,
		);
	}
});
