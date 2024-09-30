import { MessageMedia } from "whatsapp-web.js";
import { handleCommand, loading } from "../app/helpers";
import bot from "../app/bot";

export const usage = "loli";
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	await loading(msg, async () => {
		const f = await fetch("https://skizo.tech/api/loli?apikey=Gorengan");
		if (!f.ok) {
			await msg.reply("Error fetching loli");
			return;
		}
		const json = await f.json();
		console.log(json);
		const arrayBuffer = await f.arrayBuffer();
		let buffer = Buffer.from(arrayBuffer);
		const media = new MessageMedia(
			"image/jpeg",
			buffer.toString("base64"),
			"image.jpg",
		);
		await bot.sendMessage(msg.id.remote, media);
	});
});
