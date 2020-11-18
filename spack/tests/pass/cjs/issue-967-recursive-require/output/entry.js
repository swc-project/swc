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
    console.log('b');
    module.exports = 'b';
});
var load2 = __spack_require__.bind(void 0, function(module, exports) {
    var load3 = __spack_require__.bind(void 0, function(module1, exports1) {
        console.log('a-b');
        exports1.default = 'ab';
    });
    var load4 = __spack_require__.bind(void 0, function(module1, exports1) {
        var load5 = __spack_require__.bind(void 0, function(module2, exports2) {
            module2.exports = {
                default: 'a-a-a'
            };
        });
        module1.exports = load5();
    });
    var aa = load4();
    var bb = load3();
    load1();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
load2();
var b = load1();
load();
console.log(b);
