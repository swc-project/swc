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
    module.exports = class Common {
    };
});
var load1 = __swcpack_require__.bind(void 0, function(module, exports) {
    const Common = load();
    module.exports = class A extends Common {
    };
});
var load2 = __swcpack_require__.bind(void 0, function(module, exports) {
    const Common = load();
    module.exports = class B extends Common {
    };
});
var { default: A  } = load1();
var { default: B  } = load2();
console.log(A, B);
