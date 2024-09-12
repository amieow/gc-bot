import { readFileSync } from "fs";
import { formatDate, handleCommand } from "../app/helpers";
import Group from "../models/group";
import { dbgroup, dbuser } from "../app/mongodb";

// Constants for days of the week
export const daysOfWeek = [
	"senin",
	"selasa",
	"rabu",
	"kamis",
	"jumat",
] as const;
export type T_Hari = (typeof daysOfWeek)[number];
// Function to determine the day based on timestamp
export function decideDays(date: number): (typeof daysOfWeek)[number] {
	const now = new Date(date); // Convert timestamp from milliseconds
	const todayIndex = now.getDay();

	// Handle weekends
	if (todayIndex === 0 || todayIndex === 6) {
		return "senin";
	}

	const currentHour = now.getHours();
	if (currentHour >= 13) {
		const nextDayIndex = (todayIndex + 1) % 5; // Limit to weekdays
		return daysOfWeek[nextDayIndex];
	} else {
		return daysOfWeek[todayIndex - 1]; // Adjust for 0-based index
	}
}

// Function to get the schedule for a group
export function getJadwal(time: number, grup: string): string {
	const days = decideDays(time);
	const g = dbgroup[grup].jadwal;

	if (!g) return "Jadwal untuk grup ini tidak ditemukan";
	const jadwal = g[days];
	if (jadwal) {
		return jadwal.j + "\n" + `Last updated : ${formatDate(jadwal.last_update)}`;
	}

	return `Jadwal di hari ${days} belum di-set nih`;
}

// Command handler
export default handleCommand(async (chat, msg, from) => {
	if (from.group) {
		const jadwal = getJadwal(msg.timestamp, from.group as string);
		await msg.reply(jadwal);
	}
});
