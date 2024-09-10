import { scheduleMessage } from "../app/helpers";
import { CONFIG } from "../config";

const quotesAdzan = [
	"Jangan lewatkan momen berharga, sholatlah tepat waktu.",
	"Sholat adalah jembatan ke surga, jangan abaikan.",
	"Mulailah harimu dengan sholat, raih berkah setiap saat.",
	"Waktu sholat adalah waktu terbaik untuk mendekatkan diri kepada Allah.",
	"Jangan tunda sholatmu, setiap detik berharga di hadapan-Nya.",
	"Sholat bukan hanya kewajiban, tapi juga kesempatan untuk berdoa.",
	"Raih ketenangan dengan sholat, jangan biarkan dunia mengalihkan perhatianmu.",
	"Hidup lebih bermakna ketika sholat menjadi prioritas.",
	"Sholat adalah kunci ketenangan jiwa, jangan lupakan.",
	"Setiap waktu sholat adalah hadiah, jangan sia-siakan.",
	"Tinggalkan kesibukan sejenak, temui Tuhan dalam sholat.",
	"Setiap kali kamu sholat, kamu memperbarui ikatanmu dengan Allah.",
	"Jangan biarkan dunia menghalangimu dari berbicara dengan Allah.",
	"Raih kedamaian dan keseimbangan hidupmu dengan sholat.",
	"Sholat bukan hanya rutinitas, tetapi peluang untuk memperbaiki diri dan mendekat kepada Allah.",
];

interface Timings {
	Fajr: string;
	Dhuhr: string;
	Asr: string;
	Maghrib: string;
	Isha: string;
	[key: string]: string; // Untuk menutupi kemungkinan penambahan waktu sholat lainnya
}

interface DataSholat {
	data: {
		timings: Timings;
	};
}

export async function onDayChange() {
	const date = new Date();
	const resSholat = await fetch(
		`http://api.aladhan.com/v1/timingsByAddress/${encodeURIComponent(
			CONFIG.ADDRESS,
		)}&date=${date.toISOString().split("T")[0]}`,
	);

	if (!resSholat.ok) {
		console.log("Request to API aladhan failed");
		return;
	}

	// Cek struktur data yang diterima
	const jsonData: any = await resSholat.json();
	// Pastikan data sesuai dengan antarmuka yang diharapkan
	if (jsonData && jsonData.data && jsonData.data.timings) {
		const dataSholat: DataSholat = jsonData;
		for (const a in dataSholat.data.timings) {
			scheduleMessage(
				dataSholat.data.timings[a],
				CONFIG.GROUP_WHITELIST[0],
				`Sudah saatnya Adzan ${a}\n${
					quotesAdzan[Math.floor(Math.random() * quotesAdzan.length)]
				}`,
			);
		}
	} else {
		console.error("Invalid data structure:", jsonData);
	}
}
