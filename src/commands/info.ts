import { formatSerializedNumberToMention, handleCommand } from "../app/helpers";
import { dbgroup } from "../app/mongodb";

export const usage = "info";
export const description = "Info tentang grup ini";

export default handleCommand(async (chat, msg, from) => {
	if (!from.group) {
		await msg.reply("Anda tidak di grup manapun");
		return;
	}
	const group = dbgroup[from.group];
	const txt = `*Group ${group.name}*
ID : ${group.remote}
Ketua : @${formatSerializedNumberToMention(group.ketua)}
Bendahara : ${group.bendahara
		.map((v) => formatSerializedNumberToMention(v))
		.join(" ")}
Sekretaris : ${group.sekretaris
		.map((v) => formatSerializedNumberToMention(v))
		.join(" ")}`;
	await msg.reply(txt, undefined, {
		mentions: [...group.bendahara, ...group.sekretaris],
	});
});
