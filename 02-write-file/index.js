const { createWriteStream } = require('fs');
const { stdin, exit } = require('node:process');
const { join } = require('path');

let writeStream = createWriteStream(
    join(__dirname, 'result.txt'), 
    'utf8'
);

console.log('HI!');
console.log('Enter text to write to the file "result.txt" (enter exit to stop):');

stdin.on(
    'data', 
    (data) => {
        code = data
        if (data.toString('utf8') === 'exit\n') exit();
        writeStream.write(data);
    }
)

process.on('exit', () => console.log(`\nBye!`));
process.on('SIGINT', () => exit());