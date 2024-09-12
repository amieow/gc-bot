import mongoose, { Schema, Document } from "mongoose";
const t = require("mongoose-sequence");

const prSchema = new Schema({
	remote: String,
	pr: [
		{
			description: { type: String, required: true },
			id: { type: String, required: true },
		},
	],
});
interface IPr extends Document {
	remote: string;
	pr: { description: string; id: string }[];
}

const PR = mongoose.model<IPr>("PR", prSchema);

export default PR;
