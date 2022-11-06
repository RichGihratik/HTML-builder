const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');
const { join } = require('path');

const source = join(__dirname, 'files');
const dist = join(__dirname, 'files-copy')

async function main() {
    await rm(dist, { recursive: true, force: true });
    await mkdir(dist);

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

