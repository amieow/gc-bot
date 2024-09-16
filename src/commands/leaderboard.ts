import {
	delay,
	formatSerializedNumberToMention,
	handleCommand,
	loading,
} from "../app/helpers";
import Gamepoin from "../models/game";

export const usage = "leaderboard";
export const description = "Lihat leaderboard poin group";

export default handleCommand(async (chat, msg, from) => {
	await loading(msg, async () => {
		if (!from.group) {
			throw Error("Anda harus berada dalam group");
		}
		const data = await Gamepoin.findOne({
			group: from.group,
		});
		if (!data) {
			throw Error("Belum ada Poin di group ini yang ada di database");
		}
		await delay(3000);
		const leaderboard = data.leaderboard.sort((a, b) => b.poin - a.poin);
		let kata = `*Leaderboard Poin*\n`;
		leaderboard.forEach((v, i) => {
			kata += `${i + 1}. ${formatSerializedNumberToMention(v.cp)}: ${
				v.poin
			} point\n`;
		});
		await msg.reply(kata, undefined, {
			mentions: leaderboard.map((v) => v.cp),
		});
	});
});
