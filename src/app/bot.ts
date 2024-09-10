import { Client, LocalAuth, Message } from "whatsapp-web.js";
import fs from "fs";
import cron from "node-cron";
import path from "path";
import onQR from "../events/qr";
import onReady from "../events/ready";
import onDisconnected from "../events/disconnected";
import { CONFIG } from "../config";
import { delay, msgLogger } from "./helpers";
import SENDER_T from "../types/sender";
import { closeConnection } from "./mongodb";
import { onDayChange } from "../events/daychange";

const bot = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	},
});
bot.on("ready", onReady);

bot.on("qr", onQR);

bot.on("disconnected", () => {
	onDisconnected();
	bot.destroy();
	bot.initialize();
	closeConnection();
});
const commandsFolder = path.resolve("./src/commands");
const commandFiles = fs
	.readdirSync(commandsFolder)
	.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

// Memuat semua command
console.log(commandFiles);
const commands: {
	[key: string]: {
		fn: (command: string[], message: Message, from: SENDER_T) => void;
		description: string;
		usage: string;
		tags?: string;
	};
} = {};
// console.log("commands");
commandFiles.forEach(async (file) => {
	const commandModule = await import(path.join(commandsFolder, file)); // Dynamic import
	const commandName: string = commandModule.usage; // Ambil usage sebagai nama command
	const fn = commandModule.default;
	// console.log(commandName);
	if (commandName) {
		commands[commandName.split(" ")[0]] = {
			fn,
			description: commandModule.description,
			usage: commandName,
		};
	}
});

function verifid(from: SENDER_T) {
	return (
		(from.group && CONFIG.GROUP_WHITELIST.includes(from.group)) ||
		CONFIG.CONTACT_WHITELIST.includes(from.contact) ||
		CONFIG.bendahara.includes(from.contact) ||
		CONFIG.sekretaris.includes(from.contact) ||
		CONFIG.admin.includes(from.contact) ||
		CONFIG.mods.includes(from.contact)
	);
}
// console.log("command list : ", commands);
// CONFIG.bendahara.map((v) => v + "@c.us");
bot.on("message", async (message: Message) => {
	// const splt = message.id.remote.split("-");
	const a = (message.id as any).participant;
	let from: SENDER_T;
	message;
	if (a) {
		from = {
			contact: a,
			group: message.id.remote,
		};
	} else {
		from = {
			contact: message.id.remote,
		};
	}
	// await delay(2000);
	if (verifid(from) && !message.fromMe) {
		const msgContent = message.body.trim();
		msgLogger(from, message);
		if (msgContent.startsWith(CONFIG.prefix)) {
			const [commandName, ...args] = msgContent.slice(1).split(" ");

			if (commands[commandName]) {
				await delay(1000);
				commands[commandName].fn(args, message, from);
			} else {
				await message.reply("Command not recognized.");
			}
		}
	} else {
		msgLogger(from, message);
	}
});
bot.initialize();
cron.schedule("1 0 * * *", async () => {
	console.log("Menjalankan tugas setiap jam 12:01 malam");
	await onDayChange();
});
cron.schedule("0 19 * * 0-4", async (day) => {
	console.log("Menjalankan tugas setiap jam 19:01 malam");
});
const prPath = path.resolve(__dirname, "../db/pr.json");
export { commands, prPath };
// export
export default bot;
