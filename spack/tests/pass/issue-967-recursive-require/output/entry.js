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
var load = __spack_require__.bind(void 0, function(module, exports) {
    console.log('c');
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    var load2 = __spack_require__.bind(void 0, function(module, exports) {
        console.log('a-b');
        exports.default = 'ab';
    });
    var load3 = __spack_require__.bind(void 0, function(module, exports) {
        var load4 = __spack_require__.bind(void 0, function(module, exports) {
            module.exports = {
                default: 'a-a-a'
            };
        });
        module.exports = load4();
    });
    var load4 = __spack_require__.bind(void 0, function(module, exports) {
        console.log('b');
    });
    var aa = load3();
    var bb = load2();
    load4();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
load1();
var b = require('./b');
load();
console.log(b);
