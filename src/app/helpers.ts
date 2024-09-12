// import { customAlphabet } from "nanoid";
import { Message } from "whatsapp-web.js";
import SENDER_T from "../types/sender";
import { red, bgCyan, bgGreen } from "colorette";
import schedule from "node-schedule";
import bot from "./bot";
import shortUUID from "short-uuid";
// import { promises as fs } from "fs";
// const chalk = require("chalk");

export const handleCommand = (
	listener: (command: string, message: Message, from: SENDER_T) => void,
) => {
	return (command: string, message: Message, from: SENDER_T) =>
		listener(command, message, from);
};

export const formatDate = (time: number): string => {
	const now = new Date();

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
		// React with a loading emoji
		await delay(1000);
		await msg.react("🔄");

		// Execute the process (like fetching or generating something)
		await process();

		// React with a success emoji after the process is done
		await msg.react("✅");
	} catch (error) {
		// React with a failure emoji in case of an error
		await msg.react("❌");
		if (error instanceof Error) {
			await msg.reply(error.message);
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
	const job = schedule.scheduleJob({ hour, minute }, async () => {
		await bot.sendMessage(chatId, message);
		console.log(`Message sent to ${chatId} at ${time}`);
	});

	return job;
}
// export const custom = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890");
export async function msgLogger(from: SENDER_T, message: Message) {
	// const chalk = (await import("chalk")).default;
	// const splt = message.id.remote.split("-");
	const msg = message.body || (message.isGif ? "Sent a gif*" : "");
	if (from.group) {
		console.log(
			`${bgCyan(`[${from.group}]`)}${bgGreen(`[${from.contact}]`)} : ${red(
				msg,
			)}`,
		);
	} else {
		console.log(`${bgGreen(`[${from.contact}]`)} : ${red(msg)}`);
	}
	// console.log(message);
}
