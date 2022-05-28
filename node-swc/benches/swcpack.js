const fs = require('fs');
const path = require('path');
const swc = require('../../')

const Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const filename = path.join(__dirname, '..', 'input.js');

const SOURCE = fs.readFileSync(filename, 'utf8');


suite
    .add('js loader (without fs operation)', async () => {
        const res = await swc.swcpack([filename], {
            esmLoader: (_, filename, a) => {
                return [SOURCE, a];
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
