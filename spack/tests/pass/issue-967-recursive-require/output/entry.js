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
    module.exports = {
        default: 'a-a-a'
    };
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    console.log('a-b');
    exports.default = 'ab';
});
var load2 = __spack_require__.bind(void 0, function(module, exports) {
    module.exports = load();
});
var load3 = __spack_require__.bind(void 0, function(module, exports) {
    console.log('b');
});
var load4 = __spack_require__.bind(void 0, function(module, exports) {
    console.log('c');
});
var load5 = __spack_require__.bind(void 0, function(module, exports) {
    var aa = load2();
    var bb = load1();
    load3();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
load5();
var b = load3();
load4();
console.log(b);
