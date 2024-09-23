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
	Gremote,
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
}, 1250);

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
function verifid(message: Message) {
	let from = kepemilikan(message);
	const isSekretaris = dbsekretaris.hasOwnProperty(from.contact);
	const isBendahara = dbbendahara.hasOwnProperty(from.contact);
	const isMods = from.contact == CONFIG.mods;
	if (isSekretaris) {
		from.role = "sekretaris";
	}
	if (isBendahara) {
		from.role = "bendahara";
	}
	if (isMods) {
		from.role = "mod";
	}
	if (from.group && Gremote.hasOwnProperty(from.group)) {
		from.isGremote = true;
		from.child = from.group;
		from.group = Gremote[from.group];
	}
	return {
		newdata: from,
		result:
			(from.group && dbgroup.hasOwnProperty(from.group)) ||
			CONFIG.CONTACT_WHITELIST.includes(from.contact),
	};
}
// console.log("command list : ", commands);
// CONFIG.bendahara.map((v) => v + "@c.us");
bot.on("message", async (message: Message) => {
	// const splt = message.id.remote.split("-");

	let from: SENDER_T;
	// await delay(2000);
	const { newdata, result } = verifid(message);
	from = newdata;
	if (result && !message.fromMe) {
		addToQueue(async () => {
			msgLogger(from, message);
			let command = "";
			let isRegistered = dbuser && dbuser.hasOwnProperty(from.contact);
			if (isRegistered) {
				command = dbuser[from.contact].catchReply || "";
			}
			const msgContent = message.body.trim();
			if (msgContent.startsWith(CONFIG.prefix)) {
				const [commandName, ...args] = msgContent.slice(1).split(" ");
				// console.log(commandName);
				if (!isRegistered && commandName != "regist") {
					await message.reply(
						`whoops anda harus regist dulu untuk memakai bot\ncontoh : ${example}`,
					);
					return;
				}
				if (
					commands[commandName] &&
					!commands[commandName].tags?.includes("closed")
				) {
					commands[commandName].fn(args.join(" "), message, from);
				} else if (!from.group || from.isGremote) {
					await message.reply("Command tidak dikenali");
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
		});
	}
});
bot.initialize();
// nyalain kalau sedang showcase project p5
// cron.schedule(
// 	"23 0 * * *",
// 	async () => {
// 		console.log("Menjalankan tugas setiap jam 12:01 malam");
// 		onDayChange();
// 	},
// 	{
// 		timezone: "Asia/Jakarta",
// 	},
// );
// cron.schedule(
// 	"0 19 * * 0-4",
// 	async () => {
// 		console.log("Menjalankan tugas setiap jam 19:01 malam");
// 		onNineTeen();
// 	},
// 	{
// 		timezone: "Asia/Jakarta",
// 	},
// );

export { commands, kepemilikan, addToQueue };
// export
export default bot;
