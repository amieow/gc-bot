import { handleCommand, loading } from "../app/helpers";
import { dbgroup, dbuser } from "../app/mongodb";
import { CONFIG } from "../config";
import { usage as usageAnsMath } from "./ansMath";
// Fungsi untuk menghasilkan angka acak dalam rentang tertentu
function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk memilih operasi matematika secara acak
function getRandomOperation(): string {
	const operations = ["+", "-", "*"];
	return operations[Math.floor(Math.random() * operations.length)];
}

// Fungsi untuk menghitung hasil dari ekspresi matematika
function evaluateExpression(expression: string): number {
	// Menggunakan eval untuk mengevaluasi ekspresi matematika
	// Hati-hati dengan penggunaan eval dalam aplikasi produksi
	return eval(expression);
}

// Fungsi untuk membuat soal matematika acak dengan beberapa operasi
function generateComplexMathProblem(operationsCount: number) {
	if (operationsCount < 1) {
		throw new Error("Jumlah operasi harus lebih dari 0");
	}

	let expression = "";
	let currentNumber = getRandomInt(1, 100);
	expression += currentNumber;

	for (let i = 0; i < operationsCount; i++) {
		const operation = getRandomOperation();
		let nextNumber = getRandomInt(1, 100);

		expression += ` ${operation} ${nextNumber}`;
		currentNumber = nextNumber;
	}

	const result = evaluateExpression(expression);
	return {
		problem: expression,
		answer: result,
	};
}

export const usage = "math";
export const description = "Menjawab soal matematika sederhana";
export default handleCommand(async (chat, msg, from) => {
	// const text =
	// 	"berikan saya soal matematika cerita secara random saja untuk tingkat SMA satu saja, kalau ada satuan tuliskan itu dalam soalnya misal : '(m,cm)' kalau tidak tidak usah, dan yang di ans hanya number saja,kalau memungkinkan kasih soal-soal yang high order of thinking ";
	// const prompt =
	// 	"kamu disuruh bikin soal dan juga jawabannya atas tiap soal yang kamu bikin dalam format soal dulu lalu jawaban di line paling bawah 'ans = {ans}'";
	// await loading(msg, async () => {
	// 	const ai = await fetch(
	// 		`https://widipe.com/prompt/gpt?prompt=${encodeURIComponent(
	// 			prompt,
	// 		)}&text=${encodeURIComponent(text)}`,
	// 	);
	// 	if (!ai.ok) throw new Error("Error saat mengambil soal");
	// 	const data: any = await ai.json();
	// 	console.log(data);
	// 	await msg.reply(data.result);
	// });
	const jumlahoperasi = getRandomInt(1, 9);
	let { problem, answer } = generateComplexMathProblem(jumlahoperasi);
	problem = problem.replace(/\*/g, "x");
	if (from.group) {
		dbgroup[from.group].ansmath = {
			ans: String(answer),
			poin: jumlahoperasi * 5,
		};
	} else {
		dbuser[from.contact].ansmath = {
			ans: String(answer),
			poin: jumlahoperasi * 5,
		};
	}
	console.log("answer math : ", answer);
	await msg.reply(
		`*${problem} = ? (${jumlahoperasi * 5} poin)*\nuntuk menjawab ketik *${
			CONFIG.prefix
		}${usageAnsMath}*`,
	);
});
