function __swcpack_require__(mod) {
    function interop(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                        if (desc.get || desc.set) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
            }
            newObj.default = obj;
            return newObj;
        }
    }
    var cache;
    if (cache) {
        return cache;
    }
    var module = {
        exports: {}
    };
    mod(module, module.exports);
    cache = interop(module.exports);
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
var { default: A } = load1();
var { default: B } = load2();
console.log(A, B);
