const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

const nameDirSrc = 'files';
const nameDirDest = `${nameDirSrc}-copy`;

const pathSrc = path.resolve(__dirname, nameDirSrc);
const pathDest = path.resolve(__dirname, nameDirDest);

async function copyDirectory(src, dest) {
	await rm(dest, { force: true, recursive: true });
	await mkdir(dest, { recursive: true });
	
	const files = await readdir(src, { withFileTypes: true });
	
	for (const { name } of files) {
		copyFile(path.resolve(src, name), path.resolve(dest, name));
	}
}

copyDirectory(pathSrc, pathDest);
