const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');
const { join } = require('path');

const source = join(__dirname, 'files');
const dist = join(__dirname, 'files-copy');

(async function() {
    console.log('Creating folder...');
    await rm(dist, { recursive: true, force: true });
    await mkdir(dist);

    console.log('Copy files...');
    (await readdir(source, { encoding: "utf8", withFileTypes: true }))
        .forEach( file => {
            if (file.isFile()) 
                copyFile(join(source, file.name), join(dist, file.name));
        });
    console.log('Done!');
})();