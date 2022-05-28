const fs = require('fs');
const path = require('path');

const Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const filename = path.join(__dirname, '..', 'input.js');

const SOURCE = fs.readFileSync(filename, 'utf8');


suite.add('js loader (without fs operation)', async () => {
    const res = await swc.swcpack(['files'], {
        esmLoader: (_, filename, a) => {
            return [SOURCE, a];
        }
    })
}).add('rust loader', async () => {
    const res = await swc.swcpack(['files'], {
    })
}).run({ async: true });