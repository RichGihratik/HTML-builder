const { stat, readdir } = require("fs/promises");
const { join,  parse } = require('path');

const filePath = join(__dirname, 'secret-folder');

(async function() {
    let files = await readdir(
        filePath,
        {
            encoding: "utf8",
            withFileTypes: true
        }
    );
    let data = [];
    for (let file of files) {
        if (file.isFile()) {
            let parsed = parse(file.name);
            data.push({
                name: parsed.name,
                ext: parsed.ext.substring(1),
                size: (await stat(join(filePath, file.name))).size / 1024,
            })
        }
    }
    console.log('List of files: ');
    for (const file of data)
        console.log(`${file.name} - ${file.ext} - ${file.size} bytes`);
})();
