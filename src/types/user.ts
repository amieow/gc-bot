import { games } from "../models/game";

export type T_User = {
	name: string;
	absen: number;
	kelas?: string;
	catchReply?: string;
} & games;
