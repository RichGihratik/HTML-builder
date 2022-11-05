const fs = require('fs');
const { stdin } = require('node:process');
const path = require('path');

let writeStream = fs.createWriteStream(
    path.join(__dirname, 'result.txt'), 
    'utf8'
);

console.log('HI!');
console.log('Enter text to write to the file "result.txt" (enter exit to stop):');

stdin.on(
    'data', 
    (data) => {
        code = data
        if (data.toString('utf8') === 'exit\n') process.exit();
        writeStream.write(data);
    }
)

process.on('exit', () => console.log(`Bye!`));
process.on('SIGINT', exitHandler);

function exitHandler() {
    process.exit();
}


