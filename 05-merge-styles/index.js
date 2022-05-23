const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const srcDir = path.join(__dirname, 'styles');
const destDir = path.join(__dirname, 'project-dist');

async function mergeStyles(src, dest) {
	try {
		const files = await readdir(src, { withFileTypes: true });
		const writebleStream = fs.createWriteStream(path.join(dest, 'bundle.css'));

		for (const file of files) {
			const extention = file.name.split('.')[1];
			if (extention === 'css' && file.isFile()) {
				const readableStream = fs.createReadStream(path.join(src, file.name), 'utf-8');

				readableStream.on('data', (chunk) => {
					writebleStream.write(`\n${chunk}`, (err) => {
						if (err) throw err;
					});
				});

				readableStream.on('error', (err) => {
					if(err) throw err;
				});
			}
		}
	} catch (error) {
		console.log("Error: ", error);
	}
}

mergeStyles(srcDir, destDir);
