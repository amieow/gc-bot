// import { customAlphabet } from "nanoid";
import { Message } from "whatsapp-web.js";
import SENDER_T from "../types/sender";
import { red, bgCyan, bgGreen, bgBlue, bgYellow } from "colorette";
import moment from "moment-timezone";
import schedule from "node-schedule";
import bot from "./bot";
import shortUUID from "short-uuid";
// import { promises as fs } from "fs";
// const chalk = require("chalk");
export function getCurrentDate(): Date {
	return moment.utc().tz("Asia/Jakarta").toDate();
}
export const handleCommand = (
	listener: (command: string, message: Message, from: SENDER_T) => void,
) => {
	return (command: string, message: Message, from: SENDER_T) => {
		try {
			// Panggil listener dan tangani hasilnya
			listener(command, message, from);
		} catch (error) {
			// Cek tipe error jika perlu
			if (error instanceof Error) {
				console.error("Error occurred:", error.message);
				// Jika perlu, lakukan hal lain seperti logging ke sistem monitoring
			} else {
				console.error("An unknown error occurred:", error);
			}
		}
	};
};

export const formatDate = (time: number): string => {
	const now = new Date(time);

	// Opsi untuk format tanggal
	const options: Intl.DateTimeFormatOptions = {
		weekday: "long", // Hari (Senin, Selasa, dll.)
		year: "numeric", // Tahun
		month: "long", // Bulan dalam bentuk teks (Januari, Februari, dll.)
		day: "numeric", // Tanggal
		hour: "numeric", // Jam
		minute: "numeric", // Menit
		second: "numeric", // Detik
	};

	// Mengeluarkan tanggal dengan format: Senin, 11 September 2024, 13:45:30
	return now.toLocaleString("id-ID", options);
};

export async function loading(msg: Message, process: () => Promise<void>) {
	try {
		// Coba untuk bereaksi dengan emoji loading
		await msg.react("🔄");

		// Jalankan proses utama
		await process();

		// Jika pesan masih ada, bereaksi dengan emoji sukses
		await msg.react("✅");
	} catch (error) {
		// Jika ada error, bereaksi dengan emoji gagal
		try {
			// Cek apakah pesan masih ada sebelum menambahkan reaksi gagal
			await msg.react("❌");
			if (error instanceof Error) {
				await msg.reply(error.message);
			}
		} catch (err) {
			console.log(
				"Pesan mungkin telah dihapus atau tidak bisa ditambah reaksi.",
			);
		}

		// Jika error adalah instance dari Error, kirim pesan error jika bisa
		if (error instanceof Error) {
			try {
				await msg.reply(error.message);
			} catch (err) {
				console.log(
					"Tidak dapat mengirim balasan, pesan mungkin telah dihapus.",
				);
			}
		}
	}
}

import { randomBytes } from "crypto";

export function generateID(length: number): string {
	const characters = "abcdefghijklmnopqrstuvwxyz";
	const bytes = randomBytes(length);
	return [...bytes]
		.map((byte) => characters[byte % characters.length])
		.join("");
}
export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function scheduleMessage(time: string, chatId: string, message: string) {
	const [hour, minute] = time.split(":").map(Number);
	const job = schedule.scheduleJob(
		{ hour, minute, tz: "Asia/Jakarta" },
		async () => {
			await bot.sendMessage(chatId, message);
			console.log(`Message sent to ${chatId} at ${time}`);
		},
	);

	return job;
}

export function formatSerializedNumberToMention(number: string) {
	return "@" + number.replace("@c.us", "");
}
// export const custom = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890");
export async function msgLogger(from: SENDER_T, message: Message) {
	const msg = message.body || getMessageType(message); // Dapatkan tipe pesan jika tidak ada teks

	if (from.group) {
		console.log(
			// `${from.isGremote ? bgBlue(`[${from.group}]`) : ""}${bgYellow(
			// 	`[${from.group}]`,
			// )}${bgGreen(`[${from.contact}]`)} : ${red(msg)}`,
			bgBlue(`[${from.group}]`) +
				(from.isGremote ? bgYellow(`[${from.child}]`) : "") +
				bgGreen(`[${from.contact}]`) +
				" : " +
				red(msg),
		);
	} else {
		console.log(`${bgGreen(`[${from.contact}]`)} : ${red(msg)}`);
	}
}

// Fungsi untuk menentukan tipe pesan non-teks
function getMessageType(message: Message): string {
	if (message.isGif) return "Sent a gif*";
	if (message.hasMedia) {
		if (message.type === "image") return "Sent an image*";
		if (message.type === "video") return "Sent a video*";
		if (message.type === "sticker") return "Sent a sticker*";
		if (message.type === "audio") return "Sent an audio file*";
		if (message.type === "document") return "Sent a document*";
	}
	return "Sent an unsupported media*";
}
