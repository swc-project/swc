//// [test.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.testTs = {}, global.asyncToGeneratorMjs, global.interopRequireWildcardMjs);
})(this, function(exports, _asyncToGenerator, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        fn: ()=>fn,
        cl1: ()=>cl1,
        obj: ()=>obj,
        cl2: ()=>cl2,
        l: ()=>l
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        _fn = _asyncToGenerator(function*() {
            const req = yield import('./test') // ONE
            ;
        });
        return _fn.apply(this, arguments);
    }
    class cl1 {
        m() {
            return _asyncToGenerator(function*() {
                const req = yield import('./test') // TWO
                ;
            })();
        }
    }
    const obj = {
        m: /*#__PURE__*/ _asyncToGenerator(function*() {
            const req = yield import('./test') // THREE
            ;
        })
    };
    class cl2 {
        constructor(){
            this.p = {
                m: /*#__PURE__*/ _asyncToGenerator(function*() {
                    const req = yield import('./test') // FOUR
                    ;
                })
            };
        }
    }
    const l = function() {
        var _ref = _asyncToGenerator(function*() {
            const req = yield import('./test') // FIVE
            ;
        });
        return function l() {
            return _ref.apply(this, arguments);
        };
    }();
});
