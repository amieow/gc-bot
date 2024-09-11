// import { customAlphabet } from "nanoid";
import { Message } from "whatsapp-web.js";
import SENDER_T from "../types/sender";
import { red, bgCyan, bgGreen } from "colorette";
import schedule from "node-schedule";
import bot from "./bot";
// import { promises as fs } from "fs";
// const chalk = require("chalk");

export const handleCommand = (
	listener: (command: string, message: Message, from: SENDER_T) => void,
) => {
	return (command: string, message: Message, from: SENDER_T) =>
		listener(command, message, from);
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
