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
    module.exports = class Common {
    };
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    const Common = load();
    module.exports = class B extends Common {
    };
});
var load2 = __spack_require__.bind(void 0, function(module, exports) {
    const Common = load();
    module.exports = class A extends Common {
    };
});
var { __default: A  } = load2();
var { __default: B  } = load1();
console.log(A, B);
