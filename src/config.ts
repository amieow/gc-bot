let CONFIG = {
	// Prefix yang digunakan untuk menandai bahwa sebuah pesan adalah perintah.
	prefix: "/",
	city: "Yogyakarta",
	country: "IDN",

	// Daftar nomor kontak yang memiliki hak akses sebagai moderator (mod).
	mods: "6285870650187@c.us",

	// Daftar nomor kontak yang memiliki hak akses sebagai admin.
	admin: ["6285870650187@c.us"],

	// // Daftar nomor kontak yang memiliki hak akses sebagai bendahara (biasanya untuk urusan keuangan).
	// bendahara: ["62895355877890@c.us", "6281575597422@c.us"],

	// // Daftar nomor kontak yang memiliki hak akses sebagai sekretaris.
	// sekretaris: ["6281575597422@c.us"],

	// Daftar nomor kontak individu yang diizinkan menggunakan bot ini (hanya kontak yang ada di daftar ini yang bisa mengakses bot).
	CONTACT_WHITELIST: ["6285179772608@c.us", "6285870650187@c.us"],

	// URL untuk koneksi ke database MongoDB yang digunakan oleh bot ini.
	MONGODB_URL:
		"mongodb+srv://amieow:Mkaa6GPjMKYrT7OY@wabot.jrdvs.mongodb.net/?retryWrites=true&w=majority&appName=wabot",

	// Pengaturan pengingat otomatis untuk mengingatkan jadwal di hari berikutnya.
	remainder: {
		// Waktu pengingat untuk jadwal besok, ditetapkan jam dan menitnya.
		jadwal_besok: {
			jam: 19, // Jam 19:00 atau pukul 7 malam
			menit: 0, // Menit ke-0, jadi pengingat akan dikirim tepat pukul 19:00
			stop: false, // Jika true, maka pengingat ini tidak akan dikirim, jika false, maka pengingat tetap berjalan.
		},
	},
};

export { CONFIG };
