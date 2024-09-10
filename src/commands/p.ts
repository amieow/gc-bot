import bot from "../app/bot";
import { handleCommand } from "../app/helpers";

export const description = "display all the member or contacts";
export const usage = "p";

export default handleCommand(async (chat, msg) => {
	const a = await msg.getChat();
	let kata: string = ""; // Initialize 'kata' as an empty string

	// Use a loop to go through participants
	if (a.isGroup) {
		for (const element of (a as any).groupMetadata.participants) {
			const contact = await bot.getContactById(element.id._serialized);
			console.log(contact);
			kata += `> ${element.id._serialized} : ${contact.pushname}\n`;
		}
	} else {
		kata += `> ${a.id._serialized} : ${a.name}\n`;
	}

	await msg.reply(kata);
});
