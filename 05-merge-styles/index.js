const { createWriteStream, createReadStream } = require('fs');
const { readdir } = require('node:fs/promises');
const { extname, join } = require('path');

const source = join(__dirname, 'styles');
const dist = join(__dirname, 'project-dist');

const bundlePath = join(dist, 'bundle.css');

(async function() {
    let writeStream = createWriteStream(bundlePath, 'utf8');

    (await readdir( source, { encoding: "utf8", withFileTypes: true}))
    .filter(file => file.isFile() && extname(file.name) === '.css')
    .forEach(file => {
        let fileRead = createReadStream(join(source, file.name), 'utf8');
        fileRead.on('end', () => console.log(`Done! (${file.name})`));
        fileRead.pipe(writeStream, { end: false });
    });
})();