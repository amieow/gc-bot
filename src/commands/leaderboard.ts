import { formatSerializedNumberToMention, handleCommand } from "../app/helpers";
import Gamepoin from "../models/game";

export const usage = "leaderboard";
export const description = "Lihat leaderboard poin group";

export default handleCommand(async (chat, msg, from) => {
	if (!from.group) {
		await msg.reply("Anda harus berada dalam group");
		return;
	}
	const data = await Gamepoin.findOne({
		group: from.group,
	});
	if (!data) {
		await msg.reply("Belum ada Poin di group ini yang ada di database");
		return;
	}
	const leaderboard = data.leaderboard.sort((a, b) => b.poin - a.poin);
	let kata = `*Leaderboard Poin*\n`;
	leaderboard.forEach((v, i) => {
		kata += `${i + 1}. ${formatSerializedNumberToMention(v.cp)}: ${v.poin}\n`;
	});
	await msg.reply(kata, undefined, { mentions: leaderboard.map((v) => v.cp) });
});
