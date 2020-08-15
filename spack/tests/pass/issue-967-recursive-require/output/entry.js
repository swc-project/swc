function __spack_require__(mod) {
    var cache;
    return function() {
        if (cache) {
            return cache;
        }
        var module = {
            exports: {
            }
        };
        mod(module, module.exports);
        cache = module.exports;
        return cache;
    };
}
var load3 = __spack_require__.bind(void 0, function(module1, exports) {
    var load1 = __spack_require__.bind(void 0, function(module1, exports1) {
        module.exports = require('./a-a-a');
        console.log('c');
        console.log('a-b');
        exports.default = 'ab';
        module.exports = {
            default: 'a-a-a'
        };
    });
    var load2 = __spack_require__.bind(void 0, function(module1, exports) {
        console.log('b');
    });
    var aa = load1();
    var bb = load();
    load2();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
load3();
var b = load();
load();
console.log(b);
