import { T_JADWAL } from "./jadwal";

export type T_GROUP = {
	jadwal?: T_JADWAL;
	name: string;
	remote: string;
	bendahara?: string[];
	sekretaris?: string[];
	ketua?: string;
};
