import { handleCommand, loading } from "../app/helpers";
import fs from "fs";
import { dbuser } from "../app/mongodb";
import User from "../models/user";
export const description = "show pr";
export const usage = "regist <nama panggilan> <absen>";
export const example = "/regist kucing 99";
export default handleCommand(async (chat, msg, from) => {
	if (dbuser && dbuser.hasOwnProperty(from.contact)) {
		await msg.reply(`Anda sudah terdaftar, ga usah regist lagi yah :v`);
		return;
	}
	if (!/^[A-Za-z]+\s\d+$/.test(chat)) {
		await msg.reply(`Wrong format,cth : ${example}`);
	}
	await loading(msg, async () => {
		const ch = chat.split(" ");
		if (ch.length != 2) {
			await msg.reply(`Format salah, cth: ${example}`);
			return;
		}
		const [namaPanggilan, absen] = ch;
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
