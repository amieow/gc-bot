import { handleCommand, loading } from "../app/helpers";
import fs from "fs";
import { dbuser } from "../app/mongodb";
import User from "../models/user";
export const description = "show pr";
export const usage = "regist <nama panggilan> <absen>";
export const example = "/regist FFFFF 1";
export default handleCommand(async (chat, msg, from) => {
	if (!/[a-zA-Z] [0-9]/.test(chat)) {
		throw Error(`Wrong format,cth : ${example}`);
	}
	await loading(msg, async () => {
		const [namaPanggilan, absen] = chat.split(" ");
		dbuser[from.contact] = {
			name: namaPanggilan,
			absen: Number(absen),
		};
		await User.create({
			cp: from.contact,
			name: namaPanggilan,
			absen: Number(absen),
			limitAiImg: 5,
			role: "",
		});
		await msg.reply(
			`Berhasil registrasi, nama panggilan: ${namaPanggilan}, absen: ${absen}`,
		);
	});
});
