import { readFile, readFileSync } from "fs";
import bot from "../app/bot";
import { handleCommand } from "../app/helpers";
import { Message } from "whatsapp-web.js";

export const description = "jadwal kelas 12-7";
export const usage = "jadwal";

function decideDays(date: number): string {
	const now = new Date(date * 1000); // Mengkonversi timestamp dari detik ke milidetik
	const daysOfWeek = [
		"senin",
		"selasa",
		"rabu",
		"kamis",
		"jumat",
		"sabtu",
		"minggu",
	];
	const todayIndex = now.getDay();
	if (todayIndex === 0 || todayIndex === 6) {
		return "senin";
	}
	const currentHour = now.getHours();
	if (currentHour >= 13) {
		const nextDayIndex = (todayIndex + 1) % 7;
		if (nextDayIndex === 6) {
			return "senin";
		} else {
			return daysOfWeek[nextDayIndex];
		}
	} else {
		// Jika waktu sebelum jam 13:00, kembalikan hari ini
		return daysOfWeek[todayIndex];
	}
}
// import { readFileSync } from "fs";
import path from "path";

function readFileContent(fileName: string) {
	const filePath = path.join(__dirname, "..", "jadwal", `${fileName}.txt`);
	try {
		const data = readFileSync(filePath, "utf8");
		console.log("File content:", data);
		return data;
	} catch (error) {
		console.error("Error reading file:", error);
	}
	return "";
}
export function getPR(time: number) {
	const days = decideDays(time);
	return readFileContent(days);
}
export default handleCommand(async (chat, msg) => {
	const pr = getPR(msg.timestamp);
	await msg.reply(pr);
});
