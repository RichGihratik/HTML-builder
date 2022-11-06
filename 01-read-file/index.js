const { createReadStream } = require('fs');
const { stdout } = require('node:process');
const { join } = require('path');

let readableStream = createReadStream(join(__dirname, 'text.txt'), 'utf8');
readableStream.pipe(stdout);