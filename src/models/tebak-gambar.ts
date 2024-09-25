import mongoose, { Schema, Document } from "mongoose";

const tebakGambarSchema = new Schema({
	lvl: { type: Number, required: true },
	jwb: { type: String, required: true },
	img: { type: String, required: true },
	clue: { type: String, required: true },
});
interface ITebakGambar extends Document {
	lvl: number;
	jwb: string;
	img: string;
	clue: string;
}
export type tebakGambar = {
	lvl: number;
	jwb: string;
	img: string;
	clue: string;
};
const TebakGambar = mongoose.model<ITebakGambar>(
	"tebak-gambar",
	tebakGambarSchema,
);
export default TebakGambar;
