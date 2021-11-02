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
        "version": "1.2.47"
    };
});
const mod = load();
console.log(mod);
