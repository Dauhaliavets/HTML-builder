const path = require('path');
const fs = require('fs');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readableStream.on('data', (data) => console.log(data.toString()));