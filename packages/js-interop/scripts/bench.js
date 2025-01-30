const Benchmark = require('benchmark');
const lib = require('../index');


function createBabelTransform({ }) {
    return async (_, input) => {
        const { code, map } = JSON.parse(input);

        return JSON.stringify({ code, map });
    }
}

const SOURCE = 'console.log("Hello World!");';

var suite = new Benchmark.Suite;

// add tests
suite
    .add('swc (code) -> babel (code) -> swc', async function (done) {
        await lib.transform3Times(SOURCE, {}, createBabelTransform({}), {});
        done();
    })
    .add('swc (code) -> babel', async function (done) {
        await lib.transform2Times(SOURCE, {}, createBabelTransform({}));
        done();
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });
