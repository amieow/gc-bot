// db.ts
import mongoose from "mongoose";
import { CONFIG } from "../config";
import { T_User } from "../types/user";
import User from "../models/user";
import { games } from "../models/game";
import Group from "../models/group";
import { T_GROUP } from "../types/group";
import TebakKata from "../models/tebak-kata";
import { delay } from "./helpers";
let dbuser: {
	[key: string]: T_User;
} = {};

let dbgroup: {
	[key: string]: games & T_GROUP;
} = {};
let dbsekretaris: {
	[name: string]: { remote: string };
} = {};
let dbbendahara: {
	[name: string]: { remote: string };
} = {};
let dbTebakKata: {
	index: number;
	soal: string;
	jawaban: string;
}[] = [];
let Gremote: {
	[name: string]: string;
} = {};
// const uri = "your-mongodb-connection-string";
const url = process.env.MONGODB_URL || "";
async function connectToDatabase() {
	try {
		await mongoose.connect(url, {});
		console.log("Connected to MongoDB");
		const a = await TebakKata.find();
		dbTebakKata = a.map((v) => ({
			index: v.index,
			soal: v.soal,
			jawaban: v.jawaban,
		}));
		const user = await User.find();
		if (user) {
			user.forEach((user) => {
				dbuser[user.cp] = {
					name: user.name,
					absen: user.absen,
					kelas: user.kelas,
					poin: user.poin,
				};
			});
			console.log("Successfully restore user data");
		}
		const group = await Group.find();
		if (group) {
			// console.log(group);
			group.forEach((grup) => {
				grup.sekretaris.forEach((num) => {
					dbsekretaris[num] = { remote: grup.remote };
				});
				grup.bendahara.forEach((num) => {
					dbbendahara[num] = { remote: grup.remote };
				});
				// console.log(grup.jadwal);
				dbgroup[grup.remote] = {
					jadwal: grup.jadwal,
					name: grup.name,
					remote: grup.remote,
					bendahara: grup.bendahara,
					sekretaris: grup.sekretaris,
					ketua: grup.ketua,
				};
				if (grup.Gremote) Gremote[grup.Gremote] = grup.remote;
			});
			console.log("Successfully restore group data");
		}
	} catch (err) {
		console.error("Error connecting to MongoDB:", err);
		throw err;
	}
}

async function closeConnection() {
	try {
		await mongoose.disconnect();
		console.log("MongoDB connection closed");
	} catch (err) {
		console.error("Error closing MongoDB connection:", err);
		process.exit(1);
	}
}

process.on("SIGINT", async () => {
	await closeConnection();
	process.exit(0);
});

export {
	connectToDatabase,
	closeConnection,
	dbuser,
	dbgroup,
	dbsekretaris,
	dbbendahara,
	dbTebakKata,
	Gremote,
};
