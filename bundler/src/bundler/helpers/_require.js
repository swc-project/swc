function __swcpack_require__(mod) {
    var cache;

    if (cache) {
        return cache;
    }

    var module = {
        exports: {}
    };

    mod(module, module.exports);
    cache = module.exports;
    return cache;
}