//// [test.ts]
var global, factory;
global = this, factory = function(exports1, _async_to_generator, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    });
    var all = {
        get cl1 () {
            return cl1;
        },
        get cl2 () {
            return cl2;
        },
        get fn () {
            return fn;
        },
        get l () {
            return l;
        },
        get obj () {
            return obj;
        }
    };
    for(var name in all)Object.defineProperty(exports1, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    function fn() {
        return _async_to_generator._(function*() {
            yield import('./test');
        })();
    }
    class cl1 {
        m() {
            return _async_to_generator._(function*() {
                yield import('./test');
            })();
        }
    }
    let obj = {
        m: ()=>_async_to_generator._(function*() {
                yield import('./test');
            })()
    };
    class cl2 {
        constructor(){
            this.p = {
                m: ()=>_async_to_generator._(function*() {
                        yield import('./test');
                    })()
            };
        }
    }
    let l = ()=>_async_to_generator._(function*() {
            yield import('./test');
        })();
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.testTs = {}, global.asyncToGenerator, global.interopRequireWildcard);
