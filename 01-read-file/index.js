const fs = require('fs');
const { stdin, stdout } = require('node:process');
const path = require('path');

let readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf8'
);

readableStream.pipe(stdout);