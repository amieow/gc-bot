import { delay, handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import Gamepoin from "../models/game";
import User from "../models/user";
import SENDER_T from "../types/sender";
import tebakKata from "./tebakKata";
export const example = `${CONFIG.prefix}tebak pisang`;
export const tags = ["hidden"];
export const usage = `tebak <kata>`;
export const description = "no";

export async function addPoinToClient(from: SENDER_T, inc: number) {
	if (from.group) {
		const existingEntry = await Gamepoin.findOne({ group: from.group });

		if (existingEntry) {
			// Jika ada, gunakan operator $ untuk memperbarui poin
			await Gamepoin.findOneAndUpdate(
				{ group: from.group, "leaderboard.cp": from.contact },
				{
					$inc: { "leaderboard.$.poin": inc },
					$set: {
						"leaderboard.$.name": dbuser[from.contact].name,
						"leaderboard.$.absen": String(dbuser[from.contact].absen),
					},
				},
				{ new: true },
			);
		} else {
			// Jika tidak ada, tambahkan entri baru ke dalam leaderboard
			await Gamepoin.findOneAndUpdate(
				{ group: from.group },
				{
					$push: {
						leaderboard: {
							cp: from.contact,
							name: dbuser[from.contact].name,
							absen: String(dbuser[from.contact].absen),
							poin: inc,
						},
					},
				},
				{ upsert: true, new: true },
			);
		}
	} else {
		await User.findOneAndUpdate(
			{ cp: from.contact },
			{ $inc: { poin: 10 } },
			{ upsert: true },
		);
	}
}
export default handleCommand(async (chat, msg, from) => {
	if (from.group) {
		const jawab = dbgroup[from.group].anskata;
		if (jawab) {
			if (chat == jawab) {
				dbgroup[from.group].anskata = undefined;
				await addPoinToClient(from, 10);
				await msg.reply(
					`*Tebakan benar*\n+10 poin ${dbuser[from.contact].name}`,
				);
				if ((dbgroup[from.group].playestime as number) <= 5) {
					await delay(1000);
					tebakKata(chat, msg, from);
				} else {
					dbgroup[from.group].playestime = 0;
				}
				return;
			}
			let klue = "";
			for (let i = 0; i < jawab.length; i++) {
				if (i + 1 < chat.length && chat[i] == jawab[i]) {
					klue += "🟩";
				} else {
					klue += "🟥";
				}
			}
			await msg.reply(klue);
		}
		return;
	}
	const jawab = dbuser[from.contact].anskata;
	if (jawab) {
		if (chat == jawab) {
			dbuser[from.contact].anskata = undefined;
			await addPoinToClient(from, 10);
			await msg.reply(`*tebakan benar*\n+10 poin ${dbuser[from.contact].name}`);
			if ((dbuser[from.contact].playestime as number) < 5) {
				tebakKata(chat, msg, from);
			} else {
				dbuser[from.contact].playestime = 0;
			}
		} else {
			let klue = "";
			for (let i = 0; i < jawab.length; i++) {
				if (i + 1 < chat.length && chat[i] == jawab[i]) {
					klue += "🟩";
				} else {
					klue += "🟥";
				}
			}
			await msg.reply(klue);
		}
	}
});
