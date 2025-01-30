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
    .add('swc (code) -> babel (code) -> swc', {
        defer: true,
        fn: async function (deferred) {
            await lib.transform3Times(SOURCE, {}, createBabelTransform({}), {});
            deferred.resolve();
        },
    })
    .add('swc (code) -> babel', {
        defer: true,
        fn: async function (deferred) {
            await lib.transform2Times(SOURCE, {}, createBabelTransform({}));
            deferred.resolve();
        },
    })
    .add('swc', {
        defer: true,
        fn: async function (deferred) {
            await lib.transformOnce(SOURCE, {});
            deferred.resolve();
        },
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
