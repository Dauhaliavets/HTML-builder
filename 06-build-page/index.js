const path = require('path');
const fs = require('fs');
const {
	rm,
	mkdir,
	readdir,
	readFile,
	copyFile,
	writeFile,
} = require('fs/promises');

const srcDir = path.join(__dirname);
const destDir = path.join(__dirname, 'project-dist');

async function mergeStyles(src, dest) {
	try {
		const files = await readdir(src, { withFileTypes: true });
		const writebleStream = fs.createWriteStream(dest);

		for (const file of files) {
			const extention = file.name.split('.')[1];
			if (extention === 'css' && file.isFile()) {
				const readableStream = fs.createReadStream(
					path.join(src, file.name),
					'utf-8'
				);

				readableStream.on('data', (chunk) => {
					writebleStream.write(`\n${chunk}`, (err) => {
						if (err) throw err;
					});
				});

				readableStream.on('error', (err) => {
					if (err) throw err;
				});
			}
		}
	} catch (error) {
		console.log('Error: ', error);
	}
}

async function copyDirectory(src, dest) {
	await mkdir(dest, { recursive: true });
	
	const files = await readdir(src, { withFileTypes: true });
	
	for (const file of files) {
		if(file.isDirectory()) {
			copyDirectory(path.join(src, file.name), path.join(dest, file.name));
		} else {
			copyFile(path.join(src, file.name), path.join(dest, file.name));
		}
	}
}

async function buildPage(src, dest) {
	try {
		await rm(dest, { force: true, recursive: true });
		await mkdir(dest, { recursive: true });

		let template = await readFile(
			path.join(src, 'template.html'),
			'utf-8',
			(err, data) => {
				if (err) throw err;
				return data;
			}
		);

		const components = await readdir(path.join(src, 'components'), {
			withFileTypes: true,
		});

		for (const component of components) {
			const componentPath = path.join(src, 'components', component.name);
			const componentName = path.parse(componentPath).name;
			const content = await readFile(componentPath, 'utf-8', (err, data) => {
				if (err) throw err;
				return data;
			});

			template = template.replace(`{{${componentName}}}`, content);
		}
		writeFile(path.join(dest, 'index.html'), template);

		mergeStyles(path.join(src, 'styles'), path.join(dest, 'style.css'));
		copyDirectory(path.join(src, 'assets'), path.join(dest, 'assets'));

	} catch (error) {
		console.log('Error: ', error);
	}
}

buildPage(srcDir, destDir);
