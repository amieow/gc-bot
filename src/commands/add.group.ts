import { handleCommand, loading } from "../app/helpers";
import Group from "../models/group";

export const usage = "add.group <remote> <name>";
export const description = "add group into database";
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	if (!(from.role == "mods")) {
		await msg.reply("Only mods can add group");
		return;
	}
	const [remote, name] = chat.split(" ");
	if (!remote || !name) {
		await msg.reply("Invalid Data");
		return;
	}
	await loading(msg, async () => {
		await Group.create({
			remote,
			name,
		});
		await msg.reply(`Group ${name} with ID ${remote} berhasil ditambahkan`);
	});
});
