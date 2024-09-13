import bot from "../app/bot";
import { handleCommand } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { usage as usagetebak } from "./tebak";
export const description = "untuk memulai tebak kata";
export const usage = "tebakkata";

const kataBenda = [
	// Benda Umum
	"rumah",
	"mobil",
	"meja",
	"kursi",
	"buku",
	"pena",
	"komputer",
	"televisi",
	"pintu",
	"jendela",

	// Alam
	"gunung",
	"laut",
	"sungai",
	"hutan",
	"padang",
	"bunga",
	"pohon",
	"hewan",
	"burung",
	"ikan",

	// Manusia
	"pria",
	"wanita",
	"anak",
	"teman",
	"guru",
	"dokter",
	"perawat",
	"pelajar",
	"pekerja",
	"karyawan",

	// Pakaian
	"baju",
	"celana",
	"rok",
	"kaos",
	"sepatu",
	"topi",
	"jaket",
	"sabuk",

	// Makanan dan Minuman
	"nasi",
	"roti",
	"ikan",
	"daging",
	"sayur",
	"buah",
	"air",
	"teh",
	"kopi",
	"jus",

	// Tempat
	"sekolah",
	"kantor",
	"taman",
	"kafe",
	"restoran",
	"perpustakaan",
	"masjid",
	"gereja",

	// Alat dan Perlengkapan
	"telepon",
	"kamera",
	"kulkas",
	"oven",
	"mesin",
	"jam",
	"kompor",
	"sandal",
	"tas",

	// Transportasi
	"bis",
	"kereta",
	"sepeda",
	"kapal",
	"pesawat",
	"motor",
	"kendaraan",
	"truk",
	"roda",

	// Konsep Abstrak
	"cinta",
	"kebahagiaan",
	"kesedihan",
	"harapan",
	"ketakutan",
	"keberhasilan",
	"kegagalan",
	"keberanian",
	"kebebasan",
	"ketenangan",

	// Bangunan dan Infrastruktur
	"jembatan",
	"gedung",
	"jalan",
	"stasiun",
	"bandara",
	"pelabuhan",
	"tangga",
	"lift",
	"parkir",

	// Barang Elektronik
	"televisi",
	"radio",
	"laptop",
	"tablet",
	"handphone",
	"kamera",
	"printer",
	"headphone",
	"charger",
	"remote",

	// Barang dan Peralatan Rumah Tangga
	"panci",
	"wajan",
	"sapu",
	"vacuum",
	"rak",
	"lemari",
	"gorden",

	// Waktu
	"hari",
	"bulan",
	"tahun",
	"detik",
	"menit",
	"jam",
	"sejarah",
	"masa",
	"era",
	"abad",
];
const kataSifat = [
	// Sifat Fisik
	"besar",
	"kecil",
	"panjang",
	"pendek",
	"tinggi",
	"rendah",
	"berat",
	"ringan",
	"kuat",
	"lemah",
	"keras",
	"lunak",
	"baru",
	"lama",
	"bersih",
	"kotor",

	// Sifat Warna
	"merah",
	"biru",
	"hijau",
	"kuning",
	"hitam",
	"putih",
	"cokelat",
	"abu-abu",
	"oranye",
	"ungu",

	// Sifat Emosional atau Psikologis
	"bahagia",
	"sedih",
	"marah",
	"tenang",
	"cemas",
	"terkejut",
	"jengkel",
	"senang",
	"kaget",
	"malu",

	// Sifat Karakter atau Sikap
	"baik",
	"jahat",
	"ramah",
	"kasar",
	"sabar",
	"pintar",
	"bodoh",
	"jujur",
	"palsu",
	"humoris",
	"serius",

	// Sifat Kesehatan atau Kondisi
	"sehat",
	"sakit",
	"fit",
	"lelah",
	"segar",

	// Sifat Suhu atau Cuaca
	"panas",
	"dingin",
	"hangat",
	"sejuk",

	// Sifat Tekstur atau Rasa
	"halus",
	"kasar",
	"pedas",
	"manis",
	"asam",
	"pahit",
	"gurih",

	// Sifat Luas atau Ruang
	"luas",
	"sempit",
	"ramping",
	"padat",

	// Sifat Umur atau Waktu
	"muda",
	"tua",
	"segera",
	"terlambat",

	// Sifat Keteraturan atau Kualitas
	"rapi",
	"berantakan",
	"tepat",
	"salah",
	"teratur",
	"acak",
];
const kataKerja = [
	// Tindakan
	"makan",
	"minum",
	"berlari",
	"menulis",
	"membaca",
	"berbicara",
	"berjalan",
	"menyanyi",
	"memasak",
	"mencuci",
	"menggambar",
	"berpikir",
	"bermain",
	"bekerja",
	"belajar",
	"mengemudi",

	// Keadaan
	"berada",
	"tidur",
	"duduk",
	"berdiri",
	"beristirahat",
	"berpakaian",
	"bermandi",

	// Perubahan
	"menjadi",
	"berubah",
	"tumbuh",
	"memudar",
	"berkembang",
	"membaik",
	"menurun",

	// Kegiatan Sosial
	"mengenal",
	"bertemu",
	"berbicara",
	"mengundang",
	"menyapa",
	"merayakan",
	"membantu",

	// Perintah atau Permintaan
	"pergi",
	"datang",
	"berhenti",
	"mulai",
	"tunggu",
	"jangan",

	// Menghitung dan Mengukur
	"menghitung",
	"mengukur",
	"menimbang",

	// Kegiatan Kreatif
	"menciptakan",
	"merancang",
	"menyusun",
	"mengedit",
	"menulis",

	// Kegiatan Fisik
	"mengangkat",
	"mendorong",
	"menarik",
	"melempar",
	"menjatuhkan",

	// Kegiatan Elektronik dan Digital
	"mengakses",
	"mengunduh",
	"mengupload",
	"menyimpan",
	"mengedit",
	"mengirim",
];

function randomNumber(n: number) {
	return Math.floor(Math.random() * n);
}
export default handleCommand(async (chat, msg, from) => {
	const allKata = ["Benda", "Sifat", "Kerja"];
	let kataterpilih: string;
	const choosen = allKata[randomNumber(allKata.length)];
	if (choosen == "Benda")
		kataterpilih = kataBenda[randomNumber(kataBenda.length)];
	else if (choosen == "Sifat")
		kataterpilih = kataSifat[randomNumber(kataSifat.length)];
	else kataterpilih = kataKerja[randomNumber(kataKerja.length)];
	if (from.group) {
		dbgroup[from.group] = {
			...dbgroup[from.group],
			anskata: kataterpilih,
			playestime: (dbgroup[from.group].playestime || 0) + 1,
		};
	} else {
		dbuser[from.contact] = {
			...dbuser[from.contact],
			anskata: kataterpilih,
			playestime: (dbuser[from.contact].playestime || 0) + 1,
		};
	}
	console.log("Jawaban tebak kata : ", kataterpilih);
	await bot.sendMessage(
		msg.id.remote,
		`*TEBAK KATA*
clue : *Kata ${choosen}*
kata : *${kataterpilih[0] + ".".repeat(kataterpilih.length - 1)}*
untuk menjawab ketik *${CONFIG.prefix + usagetebak}*`,
	);
});
