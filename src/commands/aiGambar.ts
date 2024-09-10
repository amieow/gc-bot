import { MessageMedia } from "whatsapp-web.js";
import bot from "../app/bot";
import { handleCommand, loading } from "../app/helpers";
import { CONFIG } from "../config";

export const description = "jadwal kelas 12-7";
export const usage = "aigambar <prompt>";
export const example = `*${CONFIG.prefix}aigambar keluarga kucing sedang makan bersama*`;
export default handleCommand(async (chat, msg) => {
	// const cht = await msg.reply("Wait...");
	if (chat.length == 0 || chat[0] == "<prompt>") {
		await msg.reply(`Wrong Format, cth: ${example}`);
		return;
	}
	await loading(msg, async () => {
		let response = await fetch(
			`https://widipe.com/dalle?text=$${encodeURIComponent(chat)}`,
		);

		if (!response.ok) {
			throw new Error("Request to OpenAI API failed");
		}

		let arrayBuffer = await response.arrayBuffer();
		let buffer = Buffer.from(arrayBuffer);
		const media = new MessageMedia(
			"image/jpeg",
			buffer.toString("base64"),
			"image.jpg",
		);
		// await msg.react("✅");
		// Send the image
		await bot.sendMessage(msg.id.remote, media, {
			caption: `AI Generated Prompt : ${chat}`,
		});
	});
});
