const { mkdir, readdir, copyFile } = require('node:fs/promises');
const { extname, join } = require('path');

const source = join(__dirname, 'files');
const dist = join(__dirname, 'files-copy')

async function main() {
    await mkdir(dist, { recursive: true });

    let files = (await readdir(
        source,
        {
            encoding: "utf8",
            withFileTypes: true
        }
    ))
    .filter(file => file.isFile())
    .forEach((file) => copyFile(join(source, file.name), join(dist, file.name)));
}

main();

