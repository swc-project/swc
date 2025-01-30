const Benchmark = require('benchmark');



var suite = new Benchmark.Suite;

// add tests
suite
    .add('swc (code) -> babel (code) -> swc', function () {
        'Hello World!'.indexOf('o') > -1;
    })
    .add('swc (code) -> babel', function () {
        !!'Hello World!'.match(/o/);
    })
    .add('swc (AST) -> babel', function () {
        !!'Hello World!'.match(/o/);
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
