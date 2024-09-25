import { handleCommand, loading } from "../app/helpers";
import { dbuser } from "../app/mongodb";
import User from "../models/user";

export const usage = "set.role <user> role";
export const description = "set user role";
export const tags = ["hidden"];
export default handleCommand(async (chat, msg, from) => {
	if (!(from.role && from.role == "mods")) {
		await msg.reply("Only mods can set role");
		return;
	}
	await loading(msg, async () => {
		/**
		 * role : mods , admin
		 */
		let [users, role] = chat.split(" ");
		users = users.slice(1) + "@c.us";
		if (!users || !role) {
			throw new Error("Data belum lengkap nih");
		}
		const U = await User.findOne({ cp: users.slice(1) + "@c.us" });
		if (!U) {
			await msg.reply("User not found");
			return;
		}
		U.role = role;
		await U.save();
		dbuser[users].role = role;
		await msg.reply("Updated");
	});
});
