const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const DIRNAME = path.join(__dirname, 'secret-folder');

const readDir = async (dirname) => {
	const files = await readdir(dirname, { withFileTypes: true });

	for (const file of files) {
		if (file.isFile()) {
			fs.stat(path.join(dirname, file.name), (err, stats) => {
				if (err) throw err;
				
				let nameFile = path.parse(file.name).name;
				let extFile = path.parse(file.name).ext.slice(1);
				let sizeKbFile = (stats.size / 1024).toFixed(3);
				
				console.log(`${nameFile} - ${extFile} - ${sizeKbFile}kb`);
			});
		}
	}
};

readDir(DIRNAME);
