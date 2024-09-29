import { handleCommand } from "../app/helpers";
import { dbgroup, dbTebakKata, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { randomNumber } from "./tebakKata";
import { usage as usageTebak } from "./tebak";
export const usage = "tebakkata2";
export const description = "untuk memulai tebak kata (V2)";
export default handleCommand(async (chat, msg, from) => {
	const rand = randomNumber(dbTebakKata.length);
	const { soal, jawaban } = dbTebakKata[rand];
	if (from.group) {
		dbgroup[from.group] = {
			...dbgroup[from.group],
			anskata: jawaban,
			playestime: (dbgroup[from.group].playestime || 0) + 1,
		};
	} else {
		dbuser[from.contact] = {
			...dbuser[from.contact],
			anskata: jawaban,
			playestime: (dbuser[from.contact].playestime || 0) + 1,
		};
	}
	console.log("Jawbaan dari tebakkata v2 ", jawaban);
	await msg.reply(`
*TEBAK KATA*
clue : ${soal}
untuk menjawab ketik *${CONFIG.prefix + usageTebak}*
`);
});
