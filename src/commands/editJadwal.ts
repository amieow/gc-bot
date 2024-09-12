import { CONFIG } from "../config";
import bot, { commands } from "../app/bot";
import { handleCommand, loading } from "../app/helpers";
import { dbgroup, dbsekretaris, dbuser } from "../app/mongodb";
import Group from "../models/group";
import { T_JADWAL } from "../types/jadwal";
import { T_Hari } from "./jadwalSekolah";

export const description =
	"mengganti jadwal untuk hari tertentu senin,selasa,rabu,kamis,jumat";
export const usage = "!set-jadwal <hari>";
export const tags = ["hidden"];
// export const example = "";
export default handleCommand(async (chat, msg, from) => {
	const cht = chat.split(" ");
	if (!(cht.length > 2)) {
		await msg.reply("dikit amat kang");
		return;
	}
	await loading(msg, async () => {
		const hari = cht[0].toLowerCase();
		const jadwal = cht.slice(1).join(" ");
		const prev = dbgroup[dbsekretaris[from.contact].remote].jadwal;
		if (prev && prev[hari as T_Hari]) {
			const data = await Group.findOneAndUpdate(
				{ remote: dbsekretaris[from.contact].remote },
				{
					$set: {
						[`jadwal.${hari}`]: {
							j: jadwal,
							last_update: msg.timestamp,
						},
					},
				},
				{ new: true, upsert: false },
			);
			if (!data) throw new Error("Error group not found");

			dbgroup[dbsekretaris[from.contact].remote].jadwal = {
				...prev,
				[hari]: {
					j: jadwal,
					last_update: msg.timestamp,
				},
			};
			await msg.reply(`sukses mengubah jadwal di hari ${hari}`);
		}
	});
});
