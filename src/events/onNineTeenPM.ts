import moment from "moment-timezone";
import { dbgroup } from "../app/mongodb";
import { getJadwal } from "../commands/jadwalSekolah";
import { CONFIG } from "../config";
import bot, { addToQueue } from "../app/bot";
import PR from "../models/pr";

export async function onNineTeen() {
	const now = moment.tz("Asia/Jakarta").toDate();
	Object.keys(dbgroup).forEach(async (key) => {
		addToQueue(async () => {
			let jadwal = getJadwal(now, key);
			if (!jadwal) {
				jadwal = "Jadwal ga ketemu";
			}
			const pr = await PR.findOne({
				remote: key,
			});
			let prkata = "";
			if (pr) {
				if (pr.pr.length == 0) {
					prkata = "Ga ada pr untuk sekarang";
				} else {
					prkata = `*List tugas ${dbgroup[key].name}*`;
					pr.pr.forEach((v) => {
						prkata += `- ${v.description}\n`;
					});
				}
			} else {
				prkata = "Ga ada pr untuk sekarang";
			}
			const kata = `*Jadwal ${dbgroup[key].name}*
${jadwal}

${prkata}`;
			// console.log(kata);
			await bot.sendMessage(key, kata);
		});
	});
}
