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
import {
	closeConnection,
	connectToDatabase,
	dbbendahara,
	dbgroup,
	dbsekretaris,
	dbuser,
} from "./mongodb";
import { onDayChange } from "../events/daychange";
import { example } from "../commands/regist";
import { onNineTeen } from "../events/onNineTeenPM";
let messageQueue: (() => Promise<void>)[] = []; // Mengubah tipe array menjadi function yang mengembalikan Promise<void>

function addToQueue(task: () => Promise<void>, opt?: { blast: boolean }) {
	messageQueue.push(task); // Tambahkan tugas ke antrian
}

// Memproses satu tugas dari antrian setiap 1 detik
setInterval(async () => {
	if (messageQueue.length > 0) {
		const task = messageQueue.shift(); // Ambil tugas pertama dari antrian
		if (task) {
			try {
				await task(); // Jalankan tugas (panggil function)
			} catch (error) {
				console.error("Error processing task:", error);
			}
		}
	}
}, 2000);

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
		fn: (command: string, message: Message, from: SENDER_T) => void;
		description: string;
		usage: string;
		tags?: string[];
	};
} = {};
// console.log("commands");
commandFiles.forEach(async (file) => {
	const commandModule = await import(path.join(commandsFolder, file)); // Dynamic import
	const commandName: string = commandModule.usage; // Ambil usage sebagai nama command
	const fn = commandModule.default;
	const tags = commandModule.tags || undefined;
	// console.log(commandName);
	if (commandName) {
		commands[commandName.split(" ")[0]] = {
			fn,
			description: commandModule.description,
			usage: commandName,
			tags,
		};
	}
});

function verifid(from: SENDER_T) {
	const isSekretaris = dbsekretaris.hasOwnProperty(from.contact);
	const isBendahara = dbbendahara.hasOwnProperty(from.contact);
	const isMods = from.contact == CONFIG.mods;
	if (isSekretaris) {
		from.role = "sekretaris";
		return true;
	}
	if (isBendahara) {
		from.role = "bendahara";
		return true;
	}
	if (isMods) {
		from.role = "mod";
		return true;
	}
	return (
		(from.group && dbgroup.hasOwnProperty(from.group)) ||
		CONFIG.CONTACT_WHITELIST.includes(from.contact)
	);
}

function kepemilikan(message: Message): SENDER_T {
	const a = (message.id as any).participant;
	if (a) {
		return {
			contact: a,
			group: message.id.remote,
		};
	}
	return {
		contact: message.id.remote,
	};
}
// console.log("command list : ", commands);
// CONFIG.bendahara.map((v) => v + "@c.us");
bot.on("message", async (message: Message) => {
	// const splt = message.id.remote.split("-");
	addToQueue(async () => {
		let from = kepemilikan(message);
		// await delay(2000);
		msgLogger(from, message);
		if (verifid(from) && !message.fromMe) {
			let command = "";
			if (dbuser[from.contact].catchReply) {
				command = dbuser[from.contact].catchReply || "";
			}
			const msgContent = message.body.trim();
			if (msgContent.startsWith(CONFIG.prefix)) {
				const [commandName, ...args] = msgContent.slice(1).split(" ");
				// console.log(commandName);
				if (
					!(dbuser && dbuser.hasOwnProperty(from.contact)) &&
					commandName != "regist"
				) {
					await message.reply(
						`whoops anda harus regist dulu untuk memakai bot\ncontoh : ${example}`,
					);
					return;
				}
				if (commands[commandName]) {
					commands[commandName].fn(args.join(" "), message, from);
				} else {
					await message.reply("Command not recognized.");
				}
			} else if (command) {
				if (message.hasQuotedMsg) {
					const quotedMsg = await message.getQuotedMessage();
					const quotedFrom = kepemilikan(quotedMsg);
					if (quotedFrom.contact == bot.info.wid._serialized) {
						const [commandName, ...args] = msgContent.slice(1).split(" ");
						if (commands.hasOwnProperty(commandName)) {
							commands[command].fn(args.join(" "), message, from);
						}
					}
				}
			}
		}
	});
});
bot.initialize();
cron.schedule(
	"1 0 * * *",
	async () => {
		console.log("Menjalankan tugas setiap jam 12:01 malam");
		onDayChange();
	},
	{
		timezone: "Asia/Jakarta",
	},
);
cron.schedule(
	"0 19 * * 0-4",
	async () => {
		console.log("Menjalankan tugas setiap jam 19:01 malam");
		onNineTeen();
	},
	{
		timezone: "Asia/Jakarta",
	},
);
const prPath = path.resolve(__dirname, "../db/pr.json");
export { commands, prPath, kepemilikan, addToQueue };
// export
export default bot;
