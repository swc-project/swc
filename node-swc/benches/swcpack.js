const fs = require('fs');
const path = require('path');
const swc = require('../../')

const Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const filename = path.join(__dirname, '..', '..', 'tests', 'integration', 'three-js', 'repo', 'src', 'Three.js');

function p(fn) {
    return {
        defer: true,
        async fn(deferred) {
            await fn();
            deferred.resolve();
        }
    }
}

suite
    .add('js loader (sync)', p(async () => {
        const res = await swc.swcpack([filename], {
            esmLoader: async (filename) => {
                const src = await fs.promises.readFile(filename, 'utf8');
                return src;
            }
        });
    }))
    .add('rust loader', p(async () => {
        const res = await swc.swcpack([filename], {
        })
    }))
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    }).run({ async: true });
