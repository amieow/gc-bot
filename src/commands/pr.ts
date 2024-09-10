import { handleCommand } from "../app/helpers";
import PR from "../models/pr";
export const description = "show pr";
export const usage = "pr";
export default handleCommand(async (chat, msg) => {
	const pr = await PR.find();
	if (pr.length == 0) {
		await msg.reply("PR ga ada");
		return;
	}
	let kata = "PR kelas 12-7 : \n";
	for (const p of pr) {
		kata += `${p.id} : ${p.description}\n`;
	}
	await msg.reply(kata);
});
