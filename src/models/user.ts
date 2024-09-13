import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
	name: { type: String, required: true },
	cp: { type: String, required: true },
	limitAiImg: { type: Number, required: false },
	absen: { type: Number, required: true },
	role: { type: String, required: false },
	poin: { type: Number, required: false },
	kelas: { type: String, required: false },
	afk: {
		time: { type: Number, default: Date.now },
		reason: { type: String, default: "" },
	},
});
interface IUser extends Document {
	name: string;
	cp: string;
	limitAiImg: number;
	role?: string;
	kelas?: string;
	absen: number;
	poin?: number;
}

const User = mongoose.model<IUser>("user", userSchema);

export default User;
