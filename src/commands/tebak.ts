import {
	delay,
	formatSerializedNumberToMention,
	handleCommand,
} from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import Gamepoin from "../models/game";
import User from "../models/user";
import SENDER_T from "../types/sender";
import tebakKata from "./tebakKata";
import tebakKataCakLontong from "./tebakKataCakLontong";
export const example = `${CONFIG.prefix}tebak pisang`;
export const tags = ["hidden"];
export const usage = `tebak <kata>`;
export const description = "no";

export async function addPoinToClient(from: SENDER_T, inc: number) {
	if (from.group) {
		const existingEntry = await Gamepoin.findOne({ group: from.group });

		if (existingEntry) {
			const ind = existingEntry.leaderboard.findIndex(
				(v) => v.cp == from.contact,
			);
			if (ind == -1) {
				existingEntry.leaderboard.push({
					cp: from.contact,
					name: dbuser[from.contact].name,
					absen: String(dbuser[from.contact].absen),
					poin: inc,
				});
			} else {
				existingEntry.leaderboard[ind].poin += inc;
			}
			await existingEntry.save();
		} else {
			// Jika tidak ada, tambahkan entri baru ke dalam leaderboard
			await Gamepoin.create({
				leaderboard: [
					{
						cp: from.contact,
						name: dbuser[from.contact].name,
						absen: String(dbuser[from.contact].absen),
						poin: inc,
					},
				],
				group: from.group,
			});
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
		// if (!dbgroup[from.group].anskata) return;
		const jawab = dbgroup[from.group].anskata;
		const jawabv2 = dbgroup[from.group].anskatav2;
		if (jawab || jawabv2) {
			if (chat == jawab || chat == jawabv2) {
				await addPoinToClient(from, 10);
				await msg.reply(
					`*${
						jawab ? "Kata" : "Tebakan"
					} benar*\n+10 poin ${formatSerializedNumberToMention(from.contact)}`,
					undefined,
					{
						mentions: [from.contact],
					},
				);
				if ((dbgroup[from.group].playestime as number) <= 5) {
					await delay(1000);
					dbgroup[from.group].playestime =
						((dbgroup[from.group].playestime as number) || 0) + 1;
					if (jawab) {
						tebakKata("", msg, from);
					} else {
						tebakKataCakLontong(chat, msg, from);
					}
				} else {
					dbgroup[from.group].playestime = 0;
				}
				return;
			}
			if (jawab) {
				let klue = "";
				for (let i = 0; i < jawab.length; i++) {
					if (i + 1 < chat.length && chat[i] == jawab[i]) {
						klue += "🟩";
					} else {
						klue += "🟥";
					}
				}
				await msg.reply(klue);
			} else {
				await msg.react("🟥");
			}
		}
		return;
	}
	const jawab = dbuser[from.contact].anskata;
	const jawabv2 = dbuser[from.contact].anskatav2;
	if (jawab || jawabv2) {
		if (chat == jawab || chat == jawabv2) {
			// dbuser[from.contact].anskata = undefined;
			await addPoinToClient(from, 10);
			await msg.reply(
				`*tebakan benar*\n+10 poin ${formatSerializedNumberToMention(
					from.contact,
				)}`,
				undefined,
				{
					mentions: [from.contact],
				},
			);
			if ((dbuser[from.contact].playestime as number) < 5) {
				dbuser[from.contact].playestime =
					((dbuser[from.contact].playestime as number) || 0) + 1;
				if (jawab) {
					dbuser[from.contact].anskata = undefined;
					tebakKata(chat, msg, from);
				} else {
					dbuser[from.contact].anskatav2 = undefined;
					tebakKataCakLontong(chat, msg, from);
				}
			} else {
				dbuser[from.contact].playestime = 0;
			}
		} else {
			if (jawab) {
				let klue = "";
				for (let i = 0; i < jawab.length; i++) {
					if (i + 1 < chat.length && chat[i] == jawab[i]) {
						klue += "🟩";
					} else {
						klue += "🟥";
					}
				}
				await msg.reply(klue);
			} else {
				await msg.react("🟥");
			}
		}
	}
});
