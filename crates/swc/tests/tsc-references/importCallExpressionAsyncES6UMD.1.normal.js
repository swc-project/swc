//// [test.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_async_to_generator",
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.testTs = {}, global.asyncToGenerator, global.interopRequireWildcard);
})(this, function(exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
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
    });
    function fn() {
        return _async_to_generator._(function*() {
            const req = yield import('./test') // ONE
            ;
        })();
    }
    class cl1 {
        m() {
            return _async_to_generator._(function*() {
                const req = yield import('./test') // TWO
                ;
            })();
        }
    }
    const obj = {
        m: ()=>_async_to_generator._(function*() {
                const req = yield import('./test') // THREE
                ;
            })()
    };
    class cl2 {
        constructor(){
            this.p = {
                m: ()=>_async_to_generator._(function*() {
                        const req = yield import('./test') // FOUR
                        ;
                    })()
            };
        }
    }
    const l = ()=>_async_to_generator._(function*() {
            const req = yield import('./test') // FIVE
            ;
        })();
});
