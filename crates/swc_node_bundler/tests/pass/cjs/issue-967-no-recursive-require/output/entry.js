function __swcpack_require__(mod) {
    var cache;
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
}
var load = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('a');
});
var load1 = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('b');
});
var load2 = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('c');
});
load();
load1();
load2();
