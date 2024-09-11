import { handleCommand, loading } from "../app/helpers";
import ping from "ping";
import { CONFIG } from "../config";
export const description = "get bot info such ping,ip,city,region";
export const usage = "status";
export const title = "Check Bot Status";
export default handleCommand(async (chat, msg, from) => {
	await loading(msg, async () => {
		const res = await ping.promise.probe("google.com", {
			timeout: 10,
			min_reply: 2,
		});
		if (!res.avg) {
			throw Error("Can't get the ping");
		}
		const InfoGeo = await fetch("https://ipinfo.io/json");
		if (!InfoGeo.ok) throw Error("Cant get info ip");

		const json = (await InfoGeo.json()) as {
			ip: string;
			hostname: string;
			city: string;
			timezone: string;
			region: string;
		};
		const text = `Bot Info
Ping : ${res.avg} ms
IP : ${json.ip}
City : ${json.city}
Region : ${json.region}
Timezone : ${json.timezone}

Owner Bot : ${CONFIG.mods}`;
		await msg.reply(text);
	});
});
