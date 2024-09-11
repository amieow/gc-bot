import { handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import Gamepoin from "../models/game";
import User from "../models/user";
import tebakKata from "./tebakKata";
export const example = `${CONFIG.prefix}tebak pisang`;
export const tags = ["hidden"];
export const usage = `tebak <kata>`;
export const description = "no";
export default handleCommand(async (chat, msg, from) => {
	if (from.group) {
		const jawab = dbgroup[from.group].anskata;
		if (jawab) {
			if (chat == jawab) {
				dbgroup[from.group].anskata = undefined;
				await msg.reply("benar");
				await Gamepoin.findOneAndUpdate(
					{ group: from.group, "leaderboard.cp": from.contact },
					{
						$inc: { "leaderboard.$.poin": 10 },
						$setOnInsert: {
							"leaderboard.$.name": dbuser[from.contact].name,
							"leaderboard.$.absen": String(dbuser[from.contact].absen),
						},
					},
					{ upsert: true, new: true },
				);
				await msg.reply(
					`*Tebakan benar*\n+10 poin ${dbuser[from.contact].name}`,
				);
				if ((dbgroup[from.group].playestime as number) >= 5) {
					tebakKata(chat, msg, from);
				} else {
					dbgroup[from.group].playestime = 0;
				}
				return;
			}
			await msg.reply("*tebakan salah*");
		}
		return;
	}
	const jawab = dbuser[from.contact].anskata;
	if (jawab) {
		if (chat == jawab) {
			dbuser[from.contact].anskata = undefined;
			await User.findOneAndUpdate(
				{ cp: from.contact },
				{ $inc: { poin: 10 } },
				{ upsert: true },
			);
			await msg.reply(`*tebakan benar*\n+10 poin ${dbuser[from.contact].name}`);
			if ((dbuser[from.contact].playestime as number) < 5) {
				tebakKata(chat, msg, from);
			} else {
				dbuser[from.contact].playestime = 0;
			}
		} else {
			await msg.reply("*tebakan salah*");
		}
	}
});
