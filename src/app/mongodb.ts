// db.ts
import mongoose from "mongoose";
import { CONFIG } from "../config";
import { T_User } from "../types/user";
import User from "../models/user";
let dbuser: {
	[key: string]: T_User;
};
// const uri = "your-mongodb-connection-string";

async function connectToDatabase() {
	try {
		await mongoose.connect(CONFIG.MONGODB_URL, {});
		console.log("Connected to MongoDB");
		const user = await User.find();
		if (user) {
			user.forEach((user) => {
				dbuser[user.cp] = {
					name: user.name,
					absen: user.absen,
					role: user.role,
				};
			});
			console.log("Successfully restore client data");
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

export { connectToDatabase, closeConnection, dbuser };
