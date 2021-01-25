function __spack_require__(mod) {
    var cache;
    return (function() {
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
    })();
}
var load = __spack_require__.bind(void 0, function(module, exports) {
    console.log('b');
    module.exports = 'b';
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    var load2 = __spack_require__.bind(void 0, function(module1, exports1) {
        var load3 = __spack_require__.bind(void 0, function(module2, exports2) {
            module2.exports = {
                default: 'a-a-a'
            };
        });
        module1.exports = load3();
    });
    var load3 = __spack_require__.bind(void 0, function(module1, exports1) {
        console.log('a-b');
        exports1.default = 'ab';
    });
    var aa = load2();
    var bb = load3();
    load();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
load1();
var b = load();
var load2 = __spack_require__.bind(void 0, function(module, exports) {
    console.log('c');
});
load2();
console.log(b);
