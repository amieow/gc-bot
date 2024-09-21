import mongoose, { Schema, Document } from "mongoose";

const tebakKataSchema = new Schema({
	index: Number,
	soal: String,
	jawaban: String,
});
interface ITebakKata extends Document {
	index: number;
	soal: string;
	jawaban: string;
}
export type tebakKata = {
	index: number;
	soal: string;
	jawaban: string;
};
const TebakKata = mongoose.model<ITebakKata>("tebak-kata", tebakKataSchema);
export default TebakKata;
