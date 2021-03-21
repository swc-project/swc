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
    var load1 = __spack_require__.bind(void 0, function(module1, exports1) {
        module1.exports = 1;
    });
    module.exports = load1();
});
const a = load();
console.log(a);
