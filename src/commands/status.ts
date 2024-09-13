import { handleCommand, loading } from "../app/helpers";
import ping from "ping";
import { CONFIG } from "../config";
import osu from "node-os-utils";

export const description = "get bot info such as ping, ip, city, region";
export const usage = "status";
export const title = "Check Bot Status";

export default handleCommand(async (chat, msg, from) => {
	await loading(msg, async () => {
		const NotDetect = "Not Detect";
		const old = performance.now();

		// OS utilities
		const cpu = osu.cpu;
		const drive = osu.drive;
		const mem = osu.mem;
		const netstat = osu.netstat;
		const OS = osu.os.platform();

		// CPU Info
		let cpuPer: string | number = NotDetect;
		const cpuCore = cpu.count();
		const cpuModel = cpu.model();

		let driveTotal: string | number = NotDetect;
		let driveUsed: string | number = NotDetect;
		let drivePer: string | number = NotDetect;

		let ramTotal: string | number = NotDetect;
		let ramUsed: string | number = NotDetect;
		let ramPer: string | number = NotDetect;

		let netsIn: string | number = NotDetect;
		let netsOut: string | number = NotDetect;
		// Get the disk name, adjust based on your OS
		const diskName = process.platform === "win32" ? "C:" : "/"; // For Windows 'C:', for Unix-based systems '/'

		// Gather all the asynchronous data in parallel
		await Promise.all([
			cpu
				.usage()
				.then((cpuPercentage) => {
					cpuPer = cpuPercentage;
				})
				.catch(() => {
					cpuPer = NotDetect;
				}),
			drive
				.info(diskName)
				.then((info) => {
					driveTotal = info.totalGb + " GB";
					driveUsed = info.usedGb + " GB";
					drivePer = info.usedPercentage + "%";
				})
				.catch(() => {
					driveTotal = driveUsed = drivePer = NotDetect;
				}),
			mem
				.info()
				.then((info) => {
					ramTotal = info.totalMemMb + " MB";
					ramUsed = info.usedMemMb + " MB";
					ramPer = ((info.usedMemMb / info.totalMemMb) * 100).toFixed(2) + " %";
				})
				.catch(() => {
					ramTotal = ramUsed = ramPer = NotDetect;
				}),
			netstat
				.inOut()
				.then((info) => {
					if (typeof info !== "string" && info.total) {
						netsIn = info.total.inputMb + " MB";
						netsOut = info.total.outputMb + " MB";
					} else {
						netsIn = netsOut = NotDetect;
					}
				})
				.catch(() => {
					netsIn = netsOut = NotDetect;
				}),
		]);

		const neww = performance.now();
		const pingTime = Math.round(neww - old);

		// Generate the status message
		const txt = `
「 Status 」
OS : ${OS}
CPU Model : ${cpuModel}
CPU Core : ${cpuCore} Core
CPU : ${cpuPer}%
Ram : ${ramUsed} / ${ramTotal} (${ramPer})
Drive : ${driveUsed} / ${driveTotal} (${drivePer})
Ping : ${pingTime} ms
`;

		// Reply with the status message
		await msg.reply(txt);
	});
});
