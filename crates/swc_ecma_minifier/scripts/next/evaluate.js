const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')();
}
rl.on('line', async (data) => {
    try {
        const { name, source } = looseJsonParse(`(${data})`)
        const targetPath = path.join(__dirname, '..', '..', 'tests', 'fixture', 'next', 'raw', name.replace('.js', ''), 'input.js');


        await fs.mkdir(path.dirname(targetPath), { recursive: true });

        await fs.writeFile(targetPath, source, 'utf8');
    } catch (e) {
        console.log(`Code: (${data})`)
        console.error(e);
    }
})

