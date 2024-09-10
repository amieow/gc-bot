import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
	name: { type: String, required: true },
	cp: { type: String, required: true },
	limitAiImg: { type: Number, required: false },
	absen: { type: Number, required: true },
	role: { type: String, required: false },
});
interface IUser extends Document {
	name: string;
	cp: string;
	limitAiImg: number;
	absen: number;
	role?: string;
}

const User = mongoose.model<IUser>("user", userSchema);

export default User;
