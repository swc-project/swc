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
    module.exports = 1;
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    module.exports = load();
});
const a = load1();
console.log(a);
