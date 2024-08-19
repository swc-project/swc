//// [test.ts]
var global, factory;
global = this, factory = function(exports1, _async_to_generator, _interop_require_wildcard) {
    var _ref;
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        return (_fn = _async_to_generator._(function*() {
            yield import('./test');
        })).apply(this, arguments);
    }
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports1, {
        cl1: function() {
            return cl1;
        },
        cl2: function() {
            return cl2;
        },
        fn: function() {
            return fn;
        },
        l: function() {
            return l;
        },
        obj: function() {
            return obj;
        }
    });
    class cl1 {
        m() {
            return _async_to_generator._(function*() {
                yield import('./test');
            })();
        }
    }
    let obj = {
        m: /*#__PURE__*/ _async_to_generator._(function*() {
            yield import('./test');
        })
    };
    class cl2 {
        constructor(){
            this.p = {
                m: /*#__PURE__*/ _async_to_generator._(function*() {
                    yield import('./test');
                })
            };
        }
    }
    let l = (_ref = _async_to_generator._(function*() {
        yield import('./test');
    }), function() {
        return _ref.apply(this, arguments);
    });
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.testTs = {}, global.asyncToGenerator, global.interopRequireWildcard);
