import mongoose, { Schema, Document } from "mongoose";

const gamePoinSchema = new Schema({
	leaderboard: [{ cp: String, name: String, absen: String, poin: Number }],
	group: { type: String, required: true },
});
type user = {
	cp: string;
	name: string;
	absen: string;
	poin: number;
};
interface IGamePoin extends Document {
	leaderboard: user[];
	group: string;
}
export type games = {
	anskata?: string;
	isanskatav2?: boolean;
	ansmath?: {
		ans: string;
		poin: number;
	};
	ansGambar?: string;
	playestime?: number;
};
const Gamepoin = mongoose.model<IGamePoin>("game-poin", gamePoinSchema);
export default Gamepoin;
