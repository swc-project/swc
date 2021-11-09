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
    module.exports = {
        default: 'a-a-a'
    };
});
var load1 = __swcpack_require__.bind(void 0, function(module, exports) {
    module.exports = load();
});
var load2 = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('a-b');
    exports.default = 'ab';
});
var load3 = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('b');
    module.exports = 'b';
});
var load4 = __swcpack_require__.bind(void 0, function(module, exports) {
    var aa = load1();
    var bb = load2();
    load3();
    module.exports = {
        aa: aa,
        bb: bb
    };
});
var load5 = __swcpack_require__.bind(void 0, function(module, exports) {
    console.log('c');
});
load4();
var b = load3();
load5();
console.log(b);
