import { MessageMedia } from "whatsapp-web.js";
import bot from "../app/bot";
import { handleCommand } from "../app/helpers";
import { dbgroup, dbTebakGambar, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { usage as usageTebak } from "./jawab";
import { randomNumber } from "./tebakKata";
export const usage = "tebakgambar";
export const description = "untuk memulai tebak gambar";
export default handleCommand(async (chat, msg, from) => {
	const rand = dbTebakGambar[randomNumber(dbTebakGambar.length)];
	if (from.group) {
		dbgroup[from.group].ansGambar = rand.jwb.toLowerCase();
	} else {
		dbuser[from.contact].ansGambar = rand.jwb.toLowerCase();
	}
	const media = await MessageMedia.fromUrl(rand.img);
	await bot.sendMessage(msg.id.remote, media, {
		caption: `clue : *${rand.clue}*\nuntuk menjawab ketik *${
			CONFIG.prefix + usageTebak
		}*`,
	});
	console.log(`Jawaban tebak gambar ${rand.jwb}`);
});
