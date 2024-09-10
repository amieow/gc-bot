import mongoose, { Schema, Document } from "mongoose";
const t = require("mongoose-sequence");

const prSchema = new Schema({
	description: { type: String, required: true },
	id: { type: Number },
});
interface IPr extends Document {
	description: string;
	id: number;
}
// Terapkan plugin auto-increment ke skema
prSchema.plugin(t(mongoose), { inc_field: "id" });

const PR = mongoose.model<IPr>("PR", prSchema);

export default PR;
