import bot from "../app/bot";
import ping from "ping";
import { handleCommand } from "../app/helpers";

export const description = "ping bot server";
export const usage = "ping2";

export default handleCommand(async (chat, msg) => {
	const res = await ping.promise.probe("google.com", {
		timeout: 10,
		min_reply: 5,
	});
	if (res.avg) {
		await msg.reply(`bot ping ${res.avg} ms`);
	} else {
		await msg.reply(`ga bisa test ping`);
	}
});
