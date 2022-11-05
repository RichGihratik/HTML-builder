const { createWriteStream, createReadStream } = require('fs');
const { mkdir, readdir } = require('node:fs/promises');
const { extname, join } = require('path');

const source = join(__dirname, 'styles');
const dist = join(__dirname, 'project-dist');

const bundlePath = join(dist, 'bundle.css');

async function main() {
    let writeStream = createWriteStream(bundlePath, 'utf8');

    let files = (await readdir(
        source,
        {
            encoding: "utf8",
            withFileTypes: true
        }
    ))
    .filter(file => file.isFile())
    .map(file => join(source, file.name))
    .filter(file => extname(file) === '.css')
    .forEach(file => {
        let fileRead = createReadStream(file, 'utf8');
        fileRead.on('end', () => console.log(`Done! (${file})`));
        fileRead.pipe(writeStream, { end: false });
    });
}

main();