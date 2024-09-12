import { handleCommand } from "../app/helpers";
import { dbgroup } from "../app/mongodb";
import PR from "../models/pr";
export const description = "show pr";
export const usage = "pr";
export default handleCommand(async (chat, msg, from) => {
	const pr = await PR.findOne({ remote: from.group });
	if (!pr) {
		await msg.reply("Error finding PR");
		return;
	}
	if (pr.pr.length == 0) {
		await msg.reply("PR ga ada");
		return;
	}
	let kata = `PR ${dbgroup[pr.remote]} : \n`;
	for (const p of pr.pr) {
		kata += `ID : *${p.id}*\n- ${p.description}\n`;
	}
	await msg.reply(kata);
});
