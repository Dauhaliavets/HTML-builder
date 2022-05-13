const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = process;

const writebleStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const regexp = /exit/gm;

stdout.write(
	'\t\tПривет!\nЗдесь ты можешь ввести текст для записи в файл...\n'
);

stdin.on('data', (data) => {
	const str = data.toString();
	const isNeedExit = regexp.test(str);
	
	if (!isNeedExit) {
		writebleStream.write(str);
	} else {
		killProcess();
	}
});

process.on('SIGINT', () => killProcess());

function killProcess() {
	stdout.write('Прощальная фраза: === STOP WAR ===');
	exit();
}
