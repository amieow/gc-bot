import moment from "moment-timezone";
import { io } from "..";
import { connectToDatabase, dbgroup } from "../app/mongodb";

export default async function onReady() {
	io.emit("ready", "1");
	await connectToDatabase();
	console.log("Client connected!");
}
