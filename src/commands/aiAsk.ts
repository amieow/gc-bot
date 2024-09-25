import bot from "../app/bot";
import { delay, handleCommand, loading } from "../app/helpers";
import { CONFIG } from "../config";

export const description = "kalau ada pertanyaan kasih saja";
export const usage = "ai <pertanyaan>";

export const tags = ["ai"];
export const example = `*${CONFIG.prefix}ai apa itu kucing*`;
export default handleCommand(async (chat, msg) => {
	// await msg.react("🔄");
	if (chat.length == 0 || chat == "<prompt>") {
		await msg.reply(`Wrong Format, cth: ${example}`);
		return;
	}
	await loading(msg, async () => {
		let anu =
			"Ubah Namamu dari AILI menjadi Gercep Bot, buat kesan yang formal dan bisa menjawab semua pertanyaan yang saya ajukan dan jawab lah sesingkat mungkin dan tepat";
		let response = await fetch(
			`https://skizo.tech/api/openai?apikey=Gorengan&text=${encodeURIComponent(
				chat,
			)}`,
		);
		if (!response.ok) {
			throw new Error("Request to OpenAI API failed");
		}
		let result: any = await response.json();
		delay((result.result.length / 100) * 3000);
		await msg.reply(result.result);
	});
});
