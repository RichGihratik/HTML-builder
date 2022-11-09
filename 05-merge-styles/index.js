const { createWriteStream, createReadStream } = require('fs');
const { readdir } = require('node:fs/promises');
const { extname, join } = require('path');

const source = join(__dirname, 'styles');
const dist = join(__dirname, 'project-dist');

const bundlePath = join(dist, 'bundle.css');

(async function() {
    let writeStream = createWriteStream(bundlePath, 'utf8');

    let streams = [];
    (await readdir( source, { encoding: "utf8", withFileTypes: true}))
        .forEach(file => {
            if (file.isFile() && extname(file.name) === '.css') {
                let stream = createReadStream(join(source, file.name), 'utf8');
                stream.on('end', () => {
                    streams.shift();
                    if (streams.length !== 0) streams[0].pipe(writeStream, { end: false });
                    console.log(`Done! ${file.name}`);
                })
                streams.push(stream);
            }
    });
    if (streams.length !== 0) streams[0].pipe(writeStream, { end: false });
})();