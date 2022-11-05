const { promises: fs } = require("fs");
const { extname, join } = require('path');

const filePath = join(__dirname, 'secret-folder');

async function getFileData(fileDirent) {
    let path = join(filePath, fileDirent.name);
    return {
        name: fileDirent.name,
        ext: extname(path).substring(1),
        size: (await fs.stat(path)).size / 1024,
    }
}

async function getFilesData(files) {
    files = files.filter((file) => file.isFile());
    let newFiles = [];
    for (let file of files) newFiles.push(await getFileData(file));
    return newFiles;
}

async function main() {
    let files = await fs.readdir(
        filePath,
        {
            encoding: "utf8",
            withFileTypes: true
        }
    );

    let data = await getFilesData(files);
    console.log('List of files: ');
    for (const file of data)
        console.log(`${file.name} - ${file.ext} - ${file.size.toFixed(2)}kb`);
}

main();
