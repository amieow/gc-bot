import { handleCommand, loading } from "../app/helpers";
import fs from "fs";
import { dbuser } from "../app/mongodb";
import User from "../models/user";
import { CONFIG } from "../config";
export const description = "show pr";
export const tags = ["hidden"];
export const usage = "regist <nama panggilan> <absen>";
export const example = `${CONFIG.prefix}regist kucing 99`;
export default handleCommand(async (chat, msg, from) => {
	if (dbuser && dbuser.hasOwnProperty(from.contact)) {
		await msg.reply(`Anda sudah terdaftar, ga usah regist lagi yah :v`);
		return;
	}
	const ch = chat.split(" ");
	if (ch.length != 2 && !/^[A-Za-z]+\s\d+$/.test(chat)) {
		await msg.reply(`Format salah, \ncth: ${example}`);
	}
	await loading(msg, async () => {
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
			poin: 0,
		});
		await msg.reply(
			`Berhasil registrasi, nama panggilan: ${namaPanggilan}, absen: ${absen}`,
		);
	});
});
