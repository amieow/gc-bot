import moment from "moment-timezone";
import { io } from "..";
import { connectToDatabase, dbgroup } from "../app/mongodb";
import { getCurrentDate } from "../app/helpers";

export default async function onReady() {
	io.emit("ready", "1");
	await connectToDatabase();
	// console.log(moment.utc().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"));
	console.log("Client connected!");
}
