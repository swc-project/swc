const fs = require('fs');
const path = require('path');
const swc = require('../../')

const Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const filename = path.join(__dirname, '..', 'input.js');

const SOURCE = fs.readFileSync(filename, 'utf8');


suite
    .add('js loader (without fs operation)', async () => {
        console.log('1');

        const res = await swc.swcpack([filename], {
            esmLoader: (_, filename, a) => {
                return [SOURCE, a];
            }
        });
    })
    .add('rust loader', async () => {
        console.log('2');

        const res = await swc.swcpack([filename], {
        })
    }).run({ async: true });