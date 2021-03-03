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
    module.exports = {
        "version": "1.2.47"
    };
    const mod = function() {
        return {
        };
    }();
});
var mod = load();
console.log(mod);
