import { MessageMedia } from "whatsapp-web.js";
import bot from "../app/bot";
import { handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { usage as usageTebak } from "./jawab";
export const usage = "tebakgambar";
export const description = "untuk memulai tebak gambar";
export default handleCommand(async (chat, msg, from) => {
	const f = await fetch(
		"https://skizo.tech/api/game/tebakgambar?apikey=Gorengan",
	);
	if (!f.ok) {
		await msg.reply("Error fetching tebak gambar");
		return;
	}
	const json = (await f.json()) as {
		lvl: number;
		jwb: string;
		img: string;
		clue: string;
	};
	if (from.group) {
		dbgroup[from.group].ansGambar = json.jwb.toLowerCase();
	} else {
		dbuser[from.contact].ansGambar = json.jwb.toLowerCase();
	}
	const media = await MessageMedia.fromUrl(json.img);
	await bot.sendMessage(msg.id.remote, media, {
		caption: `clue : *${json.clue}*\nuntuk menjawab ketik *${
			CONFIG.prefix + usageTebak
		}*`,
	});
	console.log(`Jawaban tebak gambar ${json.jwb}`);
});
