import { handleCommand } from "../app/helpers";
import { dbgroup } from "../app/mongodb";
import Group from "../models/group";

export const usage = "set.group <variable> <new_value>";
export const description = "Set a variable in the bot variable";
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	if (!from.group) {
		await msg.reply("Kamu harus di group untuk memakai command ini");
		return;
	}
	if (!(from.role == "mods" || from.role == "admin")) {
		await msg.reply(
			"Only Mods or admin are allowed to change variable in this group",
		);
		return;
	}
	const [variable, value] = chat.trim().split(" ");
	if (!variable || !value) {
		await msg.reply("Invalid data\n");
		return;
	}
	switch (variable) {
		case "ketua":
			await Group.updateOne({ remote: from.group }, { $set: { ketua: value } });
			dbgroup[from.group].ketua = value;
			await msg.reply(
				`Ketua group ${from.group} telah diubah menjadi ${value}`,
			);
			break;
		case "sekretaris":
			await Group.updateOne(
				{ remote: from.group },
				{ $push: { sekretaris: value } },
			);
			if (dbgroup[from.group].sekretaris) {
				dbgroup[from.group].sekretaris?.push(value);
			} else {
				dbgroup[from.group].sekretaris = [value];
			}
			await msg.reply(
				`Sekretaris group ${from.group} telah ditambahkan menjadi ${value}`,
			);
			break;
		case "bendahara":
			await Group.updateOne(
				{ remote: from.group },
				{ $push: { bendahara: value } },
			);
			if (dbgroup[from.group].bendahara) {
				dbgroup[from.group].bendahara?.push(value);
			} else {
				dbgroup[from.group].bendahara = [value];
			}
			await msg.reply(
				`Bendahara group ${from.group} telah ditambahkan menjadi ${value}`,
			);
			break;
		default:
			await msg.reply(
				"Invalid variable\nVariable yang tersedia *bendahara*,*sekretaris*,*ketua*",
			);
			break;
	}
});
