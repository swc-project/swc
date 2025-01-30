const fs = require('node:fs');
const Benchmark = require('benchmark');
const babel = require("@babel/core");

const lib = require('../index');

function createBabelTransform({ }) {
    return async (_, input) => {
        const { code, map } = JSON.parse(input);

        return new Promise((resolve, reject) => {
            babel.transform(code, {
                inputSourceMap: map,
            }, function (err, result) {
                const { code, map } = result;
                resolve(JSON.stringify({ code, map }));
            });
        });
    }
}

const SOURCE = fs.readFileSync('./scripts/input.js.txt', 'utf8');

var suite = new Benchmark.Suite;

const firstSwcOption = {
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: true
        },
        target: 'esnext'
    }
};

const secondSwcOption = {
    jsc: {
        target: 'es2019'
    }
};

// add tests
suite
    .add('swc (code) -> babel (code) -> swc', {
        defer: true,
        fn: async function (deferred) {
            await lib.transform3Times(SOURCE, firstSwcOption, createBabelTransform({}), secondSwcOption);
            deferred.resolve();
        },
    })
    .add('swc (code) -> babel', {
        defer: true,
        fn: async function (deferred) {
            await lib.transform2Times(SOURCE, firstSwcOption, createBabelTransform({}));
            deferred.resolve();
        },
    })
    .add('swc', {
        defer: true,
        fn: async function (deferred) {
            await lib.transformOnce(SOURCE, {
                jsc: {
                    parser: {
                        syntax: 'ecmascript',
                        jsx: true
                    },
                    target: 'es2019'
                }
            });
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
