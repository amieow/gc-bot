import { io } from "..";
import { connectToDatabase, dbgroup } from "../app/mongodb";
import { onNineTeen } from "./onNineTeenPM";

export default async function onReady() {
	io.emit("ready", "1");
	await connectToDatabase();
	await onNineTeen();
	console.log("Client connected!");
}
