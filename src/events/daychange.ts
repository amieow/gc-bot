import { scheduleMessage } from "../app/helpers";
import { dbgroup } from "../app/mongodb";
import { CONFIG } from "../config";
import moment from "moment-timezone";
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
	const now = moment.tz("Asia/Jakarta").format("DD-MM-YYYY");
	const url = `http://api.aladhan.com/v1/timingsByCity/${now}?city=${CONFIG.city}&country=${CONFIG.country}&method=20`;
	const resSholat = await fetch(url);
	if (!resSholat.ok) {
		console.log("Request to API aladhan failed");
		console.log(resSholat);
		return;
	}

	// Cek struktur data yang diterima
	const jsonData = (await resSholat.json()) as DataSholat;
	// Pastikan data sesuai dengan antarmuka yang diharapkan
	if (jsonData) {
		const dataSholat = jsonData.data.timings;
		console.log(dataSholat);
		// ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Imsak"]
		// Object.keys(dataSholat).forEach((grup) => {
		// 	for (const a in dataSholat) {
		// 		scheduleMessage(
		// 			dataSholat[a],
		// 			grup,
		// 			`Sudah saatnya Adzan ${a}\n${
		// 				quotesAdzan[Math.floor(Math.random() * quotesAdzan.length)]
		// 			}`,
		// 		);
		// 	}
		// });
	} else {
		console.error("Invalid data structure:", jsonData);
	}
}
