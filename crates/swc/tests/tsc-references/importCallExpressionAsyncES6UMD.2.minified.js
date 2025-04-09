//// [test.ts]
var global, factory;
global = this, factory = function(exports1, _async_to_generator, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    });
    var all = {
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
    };
    for(var name in all)Object.defineProperty(exports1, name, {
        enumerable: !0,
        get: all[name]
    });
    function fn() {
        return /*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
            yield import('./test');
        })();
    }
    class cl1 {
        m() {
            return /*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
                yield import('./test');
            })();
        }
    }
    let obj = {
        m: ()=>/*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
                yield import('./test');
            })()
    };
    class cl2 {
        constructor(){
            this.p = {
                m: ()=>/*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
                        yield import('./test');
                    })()
            };
        }
    }
    let l = ()=>/*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
            yield import('./test');
        })();
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.testTs = {}, global.asyncToGenerator, global.interopRequireWildcard);
