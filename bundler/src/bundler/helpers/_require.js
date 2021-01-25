function __spack_require__(mod) {
    var cache;

    return function () {
        if (cache) {
            return cache;
        }

        var module = {
            exports: {}
        };

        mod(module, module.exports);
        cache = module.exports;
        return cache;
    }()
}