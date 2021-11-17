const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function (data) {
    try {
        const obj = eval(`(${data})`)

        console.log(obj)
    } catch (e) {
        console.log(`Code: (${data})`)
        console.error(e);
    }
})

