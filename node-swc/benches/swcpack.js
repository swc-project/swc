const fs = require('fs');
const path = require('path');
const swc = require('../../')

const Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const filename = path.join(__dirname, '..', 'input.js');

suite
    .add('js loader (sync)', async () => {
        const res = await swc.swcpack([filename], {
            esmLoader: (_, filename, a) => {
                const src = fs.readFileSync(filename, 'utf8');
                return [src, a];
            }
        });
    })
    .add('rust loader', async () => {
        const res = await swc.swcpack([filename], {
        })
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    }).run({ async: true });
