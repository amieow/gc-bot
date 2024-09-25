import mongoose, { Schema, Document } from "mongoose";
import { T_JADWAL } from "../types/jadwal";
const jadwalDetailSchema = new Schema({
	j: { type: String, required: true },
	last_update: { type: Number, required: true },
});

const groupSchema = new Schema({
	jadwal: {
		senin: { type: jadwalDetailSchema, required: false },
		selasa: { type: jadwalDetailSchema, required: false },
		rabu: { type: jadwalDetailSchema, required: false },
		kamis: { type: jadwalDetailSchema, required: false },
		jumat: { type: jadwalDetailSchema, required: false },
		sabtu: { type: jadwalDetailSchema, required: false },
	},
	name: { type: String, required: true },
	remote: { type: String, required: true },
	bendahara: [{ type: String, required: false }],
	sekretaris: [{ type: String, required: false }],
	ketua: { type: String, required: false },
	Gremote: { type: String, required: false },
});

interface IGroup extends Document {
	jadwal: T_JADWAL;
	name: string;
	remote: string;
	bendahara?: string[];
	sekretaris?: string[];
	ketua?: string;
	Gremote?: string;
}

const Group = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
