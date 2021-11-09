function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
!function(name) {
    return {
        resolve: (function(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(void 0);
                });
            };
        })(function*(context, args) {
            const { objects  } = yield {
                objects: 12
            };
            return (function(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {
                    }, ownKeys = Object.keys(source);
                    "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }))), ownKeys.forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            })({
            }, connectionFromArray(objects, args));
        })
    };
}("test");
