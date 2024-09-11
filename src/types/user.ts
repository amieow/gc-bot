import { games } from "../models/game";

export type T_User = {
	name: string;
	absen: number;
	role?: string;
} & games;
